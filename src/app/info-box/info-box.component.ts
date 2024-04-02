import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'info-box',
  templateUrl: './info-box.component.html',
})
export class InfoBoxComponent {
  @Input() public state: string;
  @Input() public score: string;
  @Output() public playBtn = new EventEmitter();

  constructor(private element: ElementRef) {}

  public playEvent(): void {
    this.playBtn.emit();
  }

  public get getText(): string {
    switch (this.state) {
      case '1000-pts':
        return 'Wow… May all your messages get<br />delivered as smoothly as these!<br /><b>Happy Holidays!</b>';
      case '500-pts':
        return 'We hope all your deliverability<br />wishes come true.<br /><b>Happy Holidays!</b>';
      default:
        return 'Wishing you nothing but all your<br />emails getting delivered!<br /><b>Happy Holidays!</b>';
    }
  }

  public get getTextBtn(): string {
    switch (this.state) {
      case 'game-over':
        return 'Try again';
      default:
        return 'Play again';
    }
  }

  public copyToClipboard(): void {
    const copied =
      this.element.nativeElement.querySelector('.info-card__copied');
    copied.classList.add('info-card__copied--active');
    setTimeout(() => this.hideCopiedInfo(), 1800);

    const input = this.element.nativeElement.querySelector('.clipboard');
    input.select();
    document.execCommand('copy');
    input.setSelectionRange(0, 0);
  }

  private hideCopiedInfo(): void {
    const copied =
      this.element.nativeElement.querySelector('.info-card__copied');
    copied.classList.remove('info-card__copied--active');
  }
}
