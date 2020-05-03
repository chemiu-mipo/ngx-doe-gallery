import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  Aria,
  GalleryItem,
  GalleryItemEvent,
  ItemTemplateContext,
  Loading,
  ObjectFit,
  Orientation,
  OrientationFlag,
  VerticalOrientation
} from '../../core';
import { defaultAria } from '../../core/aria';
import { ThumbnailsComponent } from '../thumbnails/thumbnails.component';
import { ViewerComponent } from '../viewer/viewer.component';

@Component({
  selector: 'doe-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent {
  @Input()
  items: GalleryItem[];

  @Input()
  selectedIndex = 0;

  @Input()
  aria: Aria = defaultAria;

  @Input()
  arrows = true;

  @Input()
  descriptions = false;

  @Input()
  errorText: string;

  @Input()
  mouseGestures = true;

  @Input()
  touchGestures = true;

  @Input()
  imageCounter = true;

  @Input()
  imageCounterOrientation: VerticalOrientation = 'bottom';

  @Input()
  loading: Loading = 'auto';

  @Input()
  loop = true;

  @Input()
  objectFit: ObjectFit = 'cover';

  @Input()
  itemTemplate: TemplateRef<ItemTemplateContext>;

  @Input()
  loadingTemplate: TemplateRef<void>;

  @Input()
  errorTemplate: TemplateRef<void>;

  @Input()
  arrowTemplate: TemplateRef<void>;

  @Input()
  thumbs = true;

  @Input()
  thumbsAutoScroll = true;

  @Input()
  thumbsOrientation: Orientation = 'bottom';

  @Input()
  thumbsArrows = true;

  @Input()
  thumbsArrowSlideByLength: number;

  @Input()
  thumbsScrollBehavior: ScrollBehavior = 'smooth';

  @Input()
  thumbTemplate: TemplateRef<any>;

  @Input()
  thumbsArrowTemplate: TemplateRef<void>;

  @Input()
  thumbErrorTemplate: TemplateRef<any>;

  @Output()
  imageClick = new EventEmitter<GalleryItemEvent>();

  @Output()
  thumbClick = new EventEmitter<GalleryItemEvent>();

  @Output()
  thumbHover = new EventEmitter<GalleryItemEvent>();

  @Output()
  descriptionClick = new EventEmitter<Event>();

  @Output()
  selection = new EventEmitter<GalleryItem>();

  @ViewChild(ViewerComponent, { static: false })
  imageViewer: ViewerComponent;

  @ViewChild(ThumbnailsComponent, { static: false })
  thumbnails: ThumbnailsComponent;

  @ViewChild(ViewerComponent, { static: false, read: ElementRef })
  imageViewerEl: ElementRef<HTMLElement>;

  @HostBinding('tabindex')
  _tabindex = 0;

  @HostBinding('class.column')
  get galleryCollumn() {
    return (
      this.thumbsOrientation === 'top' || this.thumbsOrientation === 'bottom'
    );
  }

  @HostBinding('attr.aria-label')
  get ariaLabel() {
    return this.aria && this.aria.galleryLabel;
  }

  get thumbsOrientationFlag(): OrientationFlag {
    if (
      this.thumbsOrientation === 'top' ||
      this.thumbsOrientation === 'bottom'
    ) {
      return OrientationFlag.HORIZONTAL;
    }
    return OrientationFlag.VERTICAL;
  }

  focus() {
    this.imageViewerEl.nativeElement.focus();
  }

  @HostListener('keydown.arrowright')
  next() {
    this.imageViewer.next();
  }

  @HostListener('keydown.arrowleft')
  prev() {
    this.imageViewer.prev();
  }

  onThumbClick(event: GalleryItemEvent) {
    this.imageViewer.select(event.index);
    this.thumbClick.emit(event);
    this._selectInternal(event.index);
  }

  select(index: number) {
    this.imageViewer.select(index);
    this.thumbnails.select(index);
    this._selectInternal(index);
  }

  slideThumbs(direction: number) {
    this.thumbnails.slide(direction);
  }

  _selectInternal(index: number) {
    this.selectedIndex = index;
    this.selection.emit(this.items[index]);
  }
}
