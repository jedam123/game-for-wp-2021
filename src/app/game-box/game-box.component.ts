import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';
const SHIFT = 45;
const GAME_BOX_STYLE = 'game-box';
const OBJECT_STYLE = 'game-box__object';
const GAME_BOX_START_STYLE = 'game-box--start';
const GAME_BOX_GAME_OVER_STYLE = 'game-box--game-over';
const GAME_OVER_WHITE = 'game-box--game-over-white';
const HEART_STYLE = 'game-box__heart';
const LOST_LIVE_STYLE = 'lost-live';
const NOTIFICATION_STYLE = 'notification';
const CART_STYLE = 'game-box__cart';
const LOST_STYLE = 'lost';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const ACTIVE = 'active';

const DELIVERABILITY = 'deliverability';
const BOUNCE = 'bounce';
const WARMUP = 'warmup';
const SPAM = 'spam';
const SPF = 'spf';
const DKIM = 'dkim';
const LINKS = 'links';
const MAIL = 'mail';

const DECREMENT_OBJECTS = [SPAM, LINKS, DKIM, SPF];

const DELAY = 1800;
@Component({
  selector: 'game-box',
  templateUrl: './game-box.component.html',
})
export class GameBoxComponent implements OnInit {
  public score = 0;
  public health = 4;
  public intervalsArray = new Map<number, any>();
  public gameBox: HTMLElement;
  public cloudBox: HTMLElement;
  public notificationArray: HTMLSpanElement[] = [];
  public objectCreatorInterval: any;
  public cart: HTMLElement;
  public state: string;
  private speed = 1;
  private lastPosition = 0;
  private id = 0;

  @HostListener('document:keydown', ['$event'])
  public handleKeydownEvent(event: KeyboardEvent) {
    if (!this.cart) {
      return;
    }

    this.moveCart(event);
  }

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  public ngOnInit(): void {
    this.gameBox = this.element.nativeElement.querySelector(
      `.${GAME_BOX_STYLE}`
    );

    this.gameBox.classList.add(GAME_BOX_START_STYLE);
    this.animation(true);
    this.setDefaultSettings();
  }

  private setDefaultSettings(): void {
    this.state = '';
    this.score = 0;
    this.health = 4;
    this.element.nativeElement
      .querySelectorAll(`.${HEART_STYLE}`)
      .forEach((element: HTMLSpanElement) =>
        element.classList.remove(LOST_STYLE)
      );
  }

  public startGame(): void {
    this.animation(false);
    this.gameBox.classList.remove(GAME_BOX_START_STYLE);
    this.gameBox.classList.remove(GAME_BOX_GAME_OVER_STYLE);
    this.cart = this.element.nativeElement.querySelector(`.${CART_STYLE}`);
    this.cart.style.left = '0px';

    this.setDefaultSettings();
    this.setObjectCreatorInterval();
  }

  public moveCart(event: KeyboardEvent): void {
    const cartPosition = this.cart.offsetLeft;
    let leftPostion: number;
    let shift = SHIFT;

    if (event.repeat) {
      this.speed += 38;
      shift = this.speed + SHIFT;
    } else {
      this.speed = 1;
    }

    if (event.key === ARROW_RIGHT) {
      leftPostion = cartPosition + shift;
      leftPostion = leftPostion < 674 ? leftPostion : 674;
    } else if (event.key === ARROW_LEFT) {
      leftPostion = cartPosition - shift;
      leftPostion = leftPostion < 0 ? 0 : leftPostion;
    }

    this.cart.style.left = `${leftPostion}px`;
  }

  private get drawLeftPosition(): number {
    const randomPosition = Math.floor(Math.random() * 500 + 40);
    let leftPostion: number;

    if (Math.floor(Math.random() * 2) === 0) {
      leftPostion = randomPosition;
      leftPostion = leftPostion < 750 ? leftPostion : 750;
    } else {
      leftPostion = randomPosition;
      leftPostion = leftPostion < 0 ? 0 : leftPostion;
    }

    if (this.lastPosition !== leftPostion) {
      this.lastPosition = leftPostion;
      return leftPostion;
    } else {
      return this.drawLeftPosition;
    }
  }

  private setObjectCreatorInterval(): void {
    this.objectCreatorInterval = setInterval(() => {
      const objectPositionLeft = this.drawLeftPosition;

      const object: HTMLSpanElement = this.createSpan('', [
        OBJECT_STYLE,
        this.drawObjectType,
      ]);
      object.style.left = `${objectPositionLeft}px`;
      const speed = Math.floor(Math.random() * 2) === 1 ? 7 : 6;
      const interval = setInterval(() => this.moveObject(object, speed), 32);
      this.intervalsArray.set(this.id, interval);
      this.renderer.appendChild(this.gameBox, object);
      this.id++;
    }, DELAY);
  }

  private get drawObjectType(): string {
    const type = Math.floor(Math.random() * 15);
    switch (type) {
      case 1:
        return DELIVERABILITY;
      case 4:
        return BOUNCE;
      case 7:
        return WARMUP;
      case 3:
        return SPAM;
      case 2:
        return SPF;
      case 5:
        return DKIM;
      case 6:
        return LINKS;
      default:
        return MAIL;
    }
  }

  private moveObject(object: HTMLSpanElement, speed: number): void {
    const isEndScreen = object.offsetTop > 493;

    if (!isEndScreen) {
      object.style.top = `${object.offsetTop + speed}px`;
    } else {
      this.checkCart(object);
      object.remove();

      clearInterval(this.intervalsArray.get(this.id));
      this.intervalsArray.delete(this.id);
    }
  }

  private checkCart(object: HTMLSpanElement): void {
    const type = object.classList[1];
    let objectLeft = object.offsetLeft;

    if (!this.isIncrementType(type)) {
      objectLeft = object.offsetLeft + object.getBoundingClientRect().width;
    }

    const leftCart = this.cart.offsetLeft;
    const rightCart = leftCart + 110;

    if (objectLeft >= leftCart && objectLeft <= rightCart) {
      this.score += this.getPoint(type);
    } else if (this.isIncrementType(type)) {
      this.lostLive();
    }

    if (this.health === 0) {
      this.stopGame();
      this.state = this.getState();
      this.gameBox.classList.add(GAME_OVER_WHITE);
      this.animation(true);

      setTimeout(() => {
        this.animation(false);

        setTimeout(() => {
          this.gameBox.classList.remove(GAME_OVER_WHITE);
          this.gameBox.classList.add(GAME_BOX_GAME_OVER_STYLE);
          this.animation(true);
        }, 500);
      }, 3000);
    }
  }

  private getState(): string {
    if (this.score >= 1000) {
      return '1000-pts';
    } else if (this.score >= 500) {
      return '500-pts';
    } else {
      return 'game-over';
    }
  }

  private animation(add: boolean): void {
    setTimeout(() => {
      if (add) {
        this.gameBox.classList.add(ACTIVE);
      } else {
        this.gameBox.classList.remove(ACTIVE);
      }
    }, 300);
  }

  private lostLive(): void {
    this.health--;
    const elemnts = this.element.nativeElement.querySelectorAll(
      `.${HEART_STYLE}:not(.${LOST_STYLE})`
    );

    if (elemnts.length > 0) {
      elemnts[elemnts.length - 1].classList.add(LOST_STYLE);
    }
  }

  private isIncrementType(type: string): boolean {
    return !DECREMENT_OBJECTS.find(
      (decrementObject) => decrementObject === type
    );
  }

  private getPoint(type: string): number {
    if (!this.isIncrementType(type)) {
      this.lostLive();
    }

    switch (type) {
      case DELIVERABILITY:
        this.addNotification(
          '<b>+25 PTS</b> Deliverability Monitor - spot deliverability issues',
          DELIVERABILITY
        );
        return 25;

      case BOUNCE:
        this.addNotification(
          '<b>+50 PTS</b> Bounce Shield - don’t exceed sending limits',
          BOUNCE
        );
        return 50;

      case WARMUP:
        this.addNotification(
          '<b>+100 PTS</b> Warm-up & Recovery - warm up email',
          BOUNCE
        );
        return 100;

      case SPAM:
        this.addNotification('<b>-10 PTS</b>', LOST_LIVE_STYLE);
        return -10;

      case SPF:
        this.addNotification('<b>-40 PTS</b>', LOST_LIVE_STYLE);
        return -40;

      case DKIM:
        this.addNotification('<b>-30 PTS</b>', LOST_LIVE_STYLE);
        return -30;

      case LINKS:
        this.addNotification('<b>-20 PTS</b>', LOST_LIVE_STYLE);
        return -20;

      default:
        return 10;
    }
  }

  private addNotification(text: string, className: string): void {
    this.clearNotification();
    const span: HTMLSpanElement = this.renderer.createElement('span');
    span.classList.add(NOTIFICATION_STYLE);
    span.classList.add(className);
    span.innerHTML = text;
    this.renderer.appendChild(this.gameBox, span);
    this.notificationArray.push(span);

    setTimeout(() => span.remove(), 3200);
  }

  private clearNotification(): void {
    if (!!this.notificationArray && this.notificationArray.length > 0) {
      this.notificationArray.forEach((element) => element.remove());
    }
  }

  private createSpan(text: string, classNames: string[]): HTMLSpanElement {
    const span: HTMLSpanElement = this.renderer.createElement('span');
    if (!!text) {
      span.textContent = text;
    }

    if (!!classNames) {
      classNames.forEach((className) => span.classList.add(className));
    }

    return span;
  }

  private stopGame(): void {
    this.clearNotification();
    clearInterval(this.objectCreatorInterval);
    this.element.nativeElement
      .querySelectorAll(`.${OBJECT_STYLE}`)
      .forEach((element) => element.remove());
    this.intervalsArray.forEach((interval) => clearInterval(interval));
    this.intervalsArray.clear();
  }
}
