import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  NgZone,
  OnDestroy,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { fromEvent, Subject, Subscription } from 'rxjs';
import {
  filter,
  repeat,
  skip,
  switchMap,
  take,
  takeWhile
} from 'rxjs/operators';

@Component({
  selector: 'ngx-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageViewerComponent implements OnInit, OnDestroy {
  @Input()
  items: string[];

  @Input()
  selectedItemIndex: number;

  @Output()
  selection = new EventEmitter<number>();

  itemWidth: number;

  imagesStyles: any = {};
  imagesTransition = true;

  private imagesHammerSub: Subscription;
  private resizeSub: Subscription;

  constructor(
    private zone: NgZone,
    private elRef: ElementRef,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.resizeSub = fromEvent(window, 'resize').subscribe(this.onResize);
    }
    setTimeout(this.onResize);

    const direction = Hammer.DIRECTION_HORIZONTAL;

    if (typeof Hammer !== 'undefined') {
      const hammer = new Hammer(this.elRef.nativeElement);
      hammer.get('pan').set({ direction, threshold: 5 });

      this.zone.runOutsideAngular(() => {
        const hammerInput$ = new Subject<HammerInput>();
        hammer.on('pan', (e: HammerInput) => hammerInput$.next(e));

        // This solves problem with Hammerjs, where although direction HORIZONTAL set and user touch-scrolls vertically,
        // Hammer still emits like 5 events which can shift images to side.
        // This code takes second event, which already knows the direction, and based on it determines, whether to accept the following
        // events - because the whole touch movement is horizontal, or ignore them - because it is vertical
        // Once a final event comes (touch movement is complete), the stream is restarted
        this.imagesHammerSub = hammerInput$
          .pipe(
            skip(1),
            take(1),
            // if horizontal, accept all events, otherwise take only the final event
            switchMap(e =>
              e.direction & Hammer.DIRECTION_HORIZONTAL
                ? hammerInput$
                : hammerInput$.pipe(filter(e => e.isFinal))
            ),
            // complete the stream once the final event occurs, but still emit it
            takeWhile(e => !e.isFinal, true),
            repeat()
          )
          .subscribe(e => {
            this.onPan(e);
            if (e.isFinal) {
              this.onPanEnd(e);
            }
          });
      });
    }
  }

  ngOnDestroy() {
    this.imagesHammerSub && this.imagesHammerSub.unsubscribe();
    this.resizeSub && this.resizeSub.unsubscribe();
  }

  onPan = (e: HammerInput) => {
    if (e.eventType & Hammer.INPUT_CANCEL) {
      return;
    }

    this.imagesTransition = false;
    this.shiftImages(e.deltaX + -this.selectedItemIndex * this.itemWidth);
  };

  onPanEnd = (e: HammerInput) => {
    this.imagesTransition = true;

    if (e.eventType & Hammer.INPUT_CANCEL) {
      this.center();
    } else if (
      Math.abs(e.deltaX) > Math.abs(this.itemWidth / 3) ||
      Math.abs(e.velocityX) > 0.3
    ) {
      e.deltaX > 0 ? this.prev() : this.next();
    } else {
      // no item to be selected, center the current
      this.center();
    }
  };

  prev() {
    this.select(this.selectedItemIndex - 1);
  }

  next() {
    this.select(this.selectedItemIndex + 1);
  }

  private onResize = () => {
    this.itemWidth = this.elRef.nativeElement.offsetWidth;
    this.center();
  };

  private select(index: number) {
    this.selectedItemIndex = index;
    this.selection.emit(index);
    this.center();
  }

  private center() {
    this.shiftImages(-this.selectedItemIndex * this.itemWidth);
  }

  private shiftImages(x: number) {
    this.imagesStyles = {
      transform: `translate3D(${x}px, 0px, 0px)`
    };
    this.cd.detectChanges();
  }
}
