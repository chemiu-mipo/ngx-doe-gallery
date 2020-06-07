# Doe Gallery

Performant, responsive, easy to use Angular 8+ gallery

[![CircleCI](https://circleci.com/gh/daelmaak/ngx-doe-gallery.svg?style=shield)](https://circleci.com/gh/daelmaak/ngx-doe-gallery)
[![npm](https://img.shields.io/npm/v/ngx-doe-gallery.svg)](https://www.npmjs.com/package/ngx-doe-gallery)

[**Demo**](https://daelmaak.github.io/ngx-doe-gallery/) |
[**Stackblitz**](https://stackblitz.com/edit/ngx-doe-gallery) |
[**Docs**](https://github.com/daelmaak/ngx-doe-gallery/wiki/Gallery-API) |
[**Changelog**](https://github.com/daelmaak/ngx-doe-gallery/blob/master/CHANGELOG.md)

## Why ngx-doe-gallery?

Because it gives you the doe eyes! Seriously though, use it if you need:

- Great performance and feel both on mobile and desktop
- Very small size - gallery itself has just 8kB gzipped! It also packs no dependencies
- Easy usage and lots of customizations
- It just works!

## Installation

`npm i -S ngx-doe-gallery@latest`

## Usage

In your ng module

```
import { GalleryModule } from 'ngx-doe-gallery';

@NgModule({
  imports: [ GalleryModule ]
})
...
```

In your component

```
import { GalleryImage } from 'ngx-doe-gallery';

@Component({...})
export class AppComponent {
  images = [ new GalleryImage('kitten1.jpg') ]
}
```

In your component template

```
<doe-gallery [items]="images"></doe-gallery>
```

## Development

### Install dependencies

In the root of the project, run

```
npm ci
```

### Serve

```
npm start
```

### Test

```
npm test
```
