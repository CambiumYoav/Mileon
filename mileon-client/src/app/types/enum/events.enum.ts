export enum GlobalEventHandlers {
  ABORT = 'abort',
  ANIMATIONCANCEL = 'animationcancel',
  ANIMATIONEND = 'animationend',
  ANIMATIONITERATION = 'animationiteration',
  ANIMATIONSTART = 'animationstart',
  AUXCLICK = 'auxclick',
  BEFOREINPUT = 'beforeinput',
  BLUR = 'blur',
  CANCEL = 'cancel',
  CANPLAY = 'canplay',
  CANPLAYTHROUGH = 'canplaythrough',
  CHANGE = 'change',
  CLICK = 'click',
  CLOSE = 'close',
  COMPOSITIONEND = 'compositionend',
  COMPOSITIONSTART = 'compositionstart',
  COMPOSITIONUPDATE = 'compositionupdate',
  CONTEXTMENU = 'contextmenu',
  CUECHANGE = 'cuechange',
  DOUBLECLICK = 'dblclick',
  DRAG = 'drag',
  DRAGEND = 'dragend',
  DRAGENTER = 'dragenter',
  DRAGLEAVE = 'dragleave',
  DRAGOVER = 'dragover',
  DRAGSTART = 'dragstart',
  DROP = 'drop',
  DURATIONCHANGE = 'durationchange',
  EMPTIED = 'emptied',
  ENDED = 'ended',
  ERROR = 'error',
  FOCUS = 'focus',
  FOCUSIN = 'focusin',
  FOCUSOUT = 'focusout',
  FORMDATA = 'formdata',
  GOTPOINTERCAPTURE = 'gotpointercapture',
  INPUT = 'input',
  INVALID = 'invalid',
  KEYDOWN = 'keydown',
  KEYPRESS = 'keypress',
  KEYUP = 'keyup',
  LOAD = 'load',
  LOADEDDATA = 'loadeddata',
  LOADEDMETADATA = 'loadedmetadata',
  LOADSTART = 'loadstart',
  LOSTPOINTERCAPTURE = 'lostpointercapture',
  MOUSEDOWN = 'mousedown',
  MOUSEENTER = 'mouseenter',
  MOUSELEAVE = 'mouseleave',
  MOUSEMOVE = 'mousemove',
  MOUSEOUT = 'mouseout',
  MOUSEOVER = 'mouseover',
  MOUSEUP = 'mouseup',
  PAUSE = 'pause',
  PLAY = 'play',
  PLAYING = 'playing',
  POINTERCANCEL = 'pointercancel',
  POINTERDOWN = 'pointerdown',
  POINTERENTER = 'pointerenter',
  POINTERLEAVE = 'pointerleave',
  POINTERMOVE = 'pointermove',
  POINTEROUT = 'pointerout',
  POINTEROVER = 'pointerover',
  POINTERUP = 'pointerup',
  PROGRESS = 'progress',
  RATECHANGE = 'ratechange',
  RESET = 'reset',
  RESIZE = 'resize',
  SCROLL = 'scroll',
  SECURITYPOLICYVIOLATION = 'securitypolicyviolation',
  SEEKED = 'seeked',
  SEEKING = 'seeking',
  SELECT = 'select',
  SELECTIONCHANGE = 'selectionchange',
  SELECTSTART = 'selectstart',
  SLOTCCHANGE = 'slotchange',
  STALLED = 'stalled',
  SUBMIT = 'submit',
  SUSPEND = 'suspend',
  TIMEUPDATE = 'timeupdate',
  TOGGLE = 'toggle',
  TOUCHCANCEL = 'touchcancel',
  TOUCHEND = 'touchend',
  TOUCHMOVE = 'touchmove',
  TOUCHSTART = 'touchstart',
  TRANSITIONCANCEL = 'transitioncancel',
  TRANSITIONEND = 'transitionend',
  TRANSITIONRUN = 'transitionrun',
  TRANSITIONSTART = 'transitionstart',
  VOLUMECHANGE = 'volumechange',
  WAITING = 'waiting',
  WEBKITANIMATIONEND = 'webkitanimationend',
  WEBKITANIMATIONITERATION = 'webkitanimationiteration',
  WEBKITANIMATIONSTART = 'webkitanimationstart',
  WEBKITTRANSITIONEND = 'webkittransitionend',
  WHEEL = 'wheel',
}

interface GlobalEventHandlersEventMap {
  abort: UIEvent;
  animationcancel: AnimationEvent;
  animationend: AnimationEvent;
  animationiteration: AnimationEvent;
  animationstart: AnimationEvent;
  auxclick: MouseEvent;
  beforeinput: InputEvent;
  blur: FocusEvent;
  cancel: Event;
  canplay: Event;
  canplaythrough: Event;
  change: Event;
  click: MouseEvent;
  close: Event;
  compositionend: CompositionEvent;
  compositionstart: CompositionEvent;
  compositionupdate: CompositionEvent;
  contextmenu: MouseEvent;
  cuechange: Event;
  dblclick: MouseEvent;
  drag: DragEvent;
  dragend: DragEvent;
  dragenter: DragEvent;
  dragleave: DragEvent;
  dragover: DragEvent;
  dragstart: DragEvent;
  drop: DragEvent;
  durationchange: Event;
  emptied: Event;
  ended: Event;
  error: ErrorEvent;
  focus: FocusEvent;
  focusin: FocusEvent;
  focusout: FocusEvent;
  formdata: FormDataEvent;
  gotpointercapture: PointerEvent;
  input: Event;
  invalid: Event;
  keydown: KeyboardEvent;
  keypress: KeyboardEvent;
  keyup: KeyboardEvent;
  load: Event;
  loadeddata: Event;
  loadedmetadata: Event;
  loadstart: Event;
  lostpointercapture: PointerEvent;
  mousedown: MouseEvent;
  mouseenter: MouseEvent;
  mouseleave: MouseEvent;
  mousemove: MouseEvent;
  mouseout: MouseEvent;
  mouseover: MouseEvent;
  mouseup: MouseEvent;
  pause: Event;
  play: Event;
  playing: Event;
  pointercancel: PointerEvent;
  pointerdown: PointerEvent;
  pointerenter: PointerEvent;
  pointerleave: PointerEvent;
  pointermove: PointerEvent;
  pointerout: PointerEvent;
  pointerover: PointerEvent;
  pointerup: PointerEvent;
  progress: ProgressEvent;
  ratechange: Event;
  reset: Event;
  resize: UIEvent;
  scroll: Event;
  securitypolicyviolation: SecurityPolicyViolationEvent;
  seeked: Event;
  seeking: Event;
  select: Event;
  selectionchange: Event;
  selectstart: Event;
  slotchange: Event;
  stalled: Event;
  submit: SubmitEvent;
  suspend: Event;
  timeupdate: Event;
  toggle: Event;
  touchcancel: TouchEvent;
  touchend: TouchEvent;
  touchmove: TouchEvent;
  touchstart: TouchEvent;
  transitioncancel: TransitionEvent;
  transitionend: TransitionEvent;
  transitionrun: TransitionEvent;
  transitionstart: TransitionEvent;
  volumechange: Event;
  waiting: Event;
  webkitanimationend: Event;
  webkitanimationiteration: Event;
  webkitanimationstart: Event;
  webkittransitionend: Event;
  wheel: WheelEvent;
}
