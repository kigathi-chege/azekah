import { NgModule } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { DynamicPipePipe } from './pipes/dynamic-pipe.pipe';
import { OptionsComponent } from './components/options/options.component';
import { FormComponent } from './components/form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabelComponent } from './components/label/label.component';
import { DynamicSearchSelectComponent } from './components/dynamic-search-select/dynamic-search-select.component';
import { SearchSelectComponent } from './components/search-select/search-select.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ButtonSelectComponent } from './components/button-select/button-select.component';
import { ListCardComponent } from './components/list-card/list-card.component';

@NgModule({
  declarations: [
    CardComponent,
    FooterComponent,
    DynamicPipePipe,
    OptionsComponent,
    FormComponent,
    LabelComponent,
    DynamicSearchSelectComponent,
    SearchSelectComponent,
    PaginationComponent,
    BreadcrumbComponent,
    ButtonSelectComponent,
    ListCardComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    CardComponent,
    OptionsComponent,
    FormComponent,
    LabelComponent,
    SearchSelectComponent,
    PaginationComponent,
    BreadcrumbComponent,
    ButtonSelectComponent,
    ListCardComponent,
  ],
})
export class NgzModule {}
