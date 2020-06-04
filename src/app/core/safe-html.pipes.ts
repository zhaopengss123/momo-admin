import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';
 
// https://angular.io/guide/security
@Pipe({ name: 'safesHtml' })
export class SafeHtmlPipes implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
 
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}