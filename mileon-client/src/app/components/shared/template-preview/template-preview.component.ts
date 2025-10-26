import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { Template } from '../../../types/templates/template.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-preview',
  templateUrl: './template-preview.component.html',
  styleUrls: ['./template-preview.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TemplatePreviewComponent {
  private readonly sanitizer = inject(DomSanitizer);

  @Input() isPic: boolean = false;
  @Input() template!: Template;
  @Output() addNewTemplate = new EventEmitter<void>();
  @Output() editTemplate = new EventEmitter<any>();

  get isNew(): boolean {
    return this.template.templateID === 'NEW';
  }

  onClick(event: any) {
    if (this.isNew) {
      this.addNewTemplate.emit();
      return;
      // add
    }
    this.editTemplate.emit(this.template);
    // edit
  }

  getSanitizedHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html || '');
  }

  getSafeUrl(data: string): SafeResourceUrl {
    // If it's already a complete data URL, sanitize and return
    if (data.startsWith('data:')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(data);
    }

    // If it's just base64, determine type and create data URL
    const mimeType = this.getMimeType(data);
    const dataUrl = `data:${mimeType};base64,${data}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
  }

  // Check if it's a PDF
  isPdf(data: string): boolean {
    return (
      data.startsWith('data:application/pdf;base64') ||
      this.getMimeType(data) === 'application/pdf'
    );
  }

  // Check if it's an image
  isImage(data: string): boolean {
    // Check base64 signature for images
    const base64Data = this.extractBase64(data);
    if (base64Data.startsWith('/9j/')) return true; // JPEG
    if (base64Data.startsWith('iVBOR')) return true; // PNG
    if (base64Data.startsWith('R0lGOD')) return true; // GIF
    if (base64Data.startsWith('UklGRg')) return true; // WebP

    return false;
  }

  // Extract base64 data from data URL
  private extractBase64(data: string): string {
    if (data.startsWith('data:')) {
      return data.split(',')[1] || '';
    }
    return data;
  }

  // Determine MIME type from base64 data
  private getMimeType(data: string): string {
    // If it's already a data URL, extract the MIME type
    if (data.startsWith('data:')) {
      const mimeMatch = data.match(/data:([^;]+);base64/);
      return mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    }

    // Check base64 signature
    if (data.startsWith('JVBERi0')) return 'application/pdf'; // PDF
    if (data.startsWith('/9j/')) return 'image/jpeg'; // JPEG
    if (data.startsWith('iVBOR')) return 'image/png'; // PNG
    if (data.startsWith('R0lGOD')) return 'image/gif'; // GIF
    if (data.startsWith('UklGRg')) return 'image/webp'; // WebP

    return 'application/octet-stream';
  }
}