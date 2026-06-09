declare module "pdfkit" {
  import { EventEmitter } from "events";
  interface PDFDocumentOptions {
    size?: string;
    margins?: { top: number; bottom: number; left: number; right: number };
    info?: Record<string, any>;
  }
  interface TextOptions {
    width?: number;
    align?: string;
    continued?: boolean;
    underline?: boolean;
    link?: string;
  }
  class PDFDocument extends EventEmitter {
    constructor(options?: PDFDocumentOptions);
    font(font: string): this;
    fontSize(size: number): this;
    fillColor(color: string): this;
    text(text: string, x?: number, y?: number, options?: TextOptions): this;
    moveDown(lines?: number): this;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    strokeColor(color: string): this;
    stroke(): this;
    end(): void;
    y: number;
  }
  export = PDFDocument;
}
