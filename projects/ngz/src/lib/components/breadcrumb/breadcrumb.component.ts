import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngz-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent  implements OnInit {
  @Output() breadcrumbLoaded = new EventEmitter<string>();
  private destroyed$ = new Subject();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  menuItems: any = [];

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroyed$)
      )
      .subscribe((event: any) => {
        this.menuItems = this.createBreadcrumbs(this.activatedRoute.root);
        if (this.menuItems.length > 0) {
          this.breadcrumbLoaded.emit('breadcrumb-loaded');
        }
      });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: any[] = []
  ): any {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'];
      if (label) {
        breadcrumbs.push({ label, url });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
  }

  goTo(url: string, menuItemsIndex: number) {
    if (this.menuItems.length != menuItemsIndex + 1) {
      this.router.navigate([url]);
    }
  }
}

