import FlxG from "../../FlxG.js";
import FlxSprite from "../../FlxSprite.js";
import FlxFrame from "../../graphics/frames/FlxFrame.js";
import FlxDestroyUtil from "../../util/FlxDestroyUtil.js";
import FlxSignal from "../../util/FlxSignal.js";

export class FlxAnimationController {
  #curAnim;
  #frameIndex;
  #frameName;
  #name;
  #finished;
  #numFrames;
  #timeScale = 1.0
  static callback = null
  static finishCallback = null;
  get curAnim() {
    return this.#curAnim;
  }
  set curAnim(value) {
    this.#curAnim = value;
  }
  get frameIndex() {
    return this.#frameIndex;
  }
  set frameIndex(value) {
    this.#frameIndex = value;
  }
  get frameName() {
    return this.#frameName;
  }
  set frameName(value) {
    this.#frameName = value;
  }
  get name() {
    return this.#name;
  }
  set name(value) {
    this.#name = value;
  }
  get finished() {
    return this.#finished;
  }
  // neverと同じ
  get numFrames() {
    return this._sprite.frames?.numFrames ?? 0;
  }
  onFrameChange = new FlxTypedSignal();
  onFinish = new FlxTypedSignal();
  onLoop = new FlxTypeSignal();
  _sprite;
  _curAnim;
  _animations = new Map();
  _prerotated;
  new(sprite) {
    this._sprite = sprite;
  }
  update(elapsed) {
    if (this._curAnim != null) {
      _curAnim.update(elapsed * (timeScale * FlxG.animationTimeScale));
    } else if (this._protated != null) {
      this._prerotated.angle = this._sprite.angle;
    }
  }
  copyFrom(controller) {
    this.destroyAnimations();
    for (anim in controller._animations) {
      add(anim.name, anim.frames, anim.frameRate, anim.looped, anim.flipX, anim.flipY);
    }
    if (controller._prerotated != null) {
      this.createPreroatated();
    }
    if (controller.name != null) {
      this.#name = controller.name;
    }
    this.#frameIndex = controller.frameIndex;
    return this;
  }
  createPreroated(Controller = null) {
    this.destroyAnimations();
    Controller = (Controller != null)  ? Controller : this;
    this._prerotated = new FlxPrerotatedAnimation(Controller, Controller._sprite.bakedRotationAngle);
    this._prerotated.angle = this._sprite.angle;
  }
  destroyAnimations() {
    this.clearAnimations();
    this.clearPrerotated();
  }
  destroy() {
    FlxDestroyUtil.destroy(onFrameChange);
    FlxDestroyUtil.destroy(onFinish);
    FlxDestroyUtil.destroy(onLoop);
    this.destroyAnimation();
    this._animations = null;
    this.callback = null;
    this.finishCallback = null;
    this._sprite = null;
  }
  getFrameDuration(index) {
    return this._sprite.frames.frames[index].duration;
  }
  clearPrerotated() {
    if (this._animations != null) {
      anim = null;
      for (const key in this._animations.keys()) {
        this.anim = this._animations.get(key);
        if (this.anim != null) {
          this.anim.destroy();
        }
      }
    }
    this._animation = new Map();
    this._curAnim = null;
  }
  add(name, frames, frameRate, looped, flipX, flipY) {
    if (this.numFrames == 0) {
      console.warn(`Could not create animation: ${name}, this sprite has no frames`);
      return;
    }
    this.framesToAdd = this.frames;
    this.hasInvalidFrames = false;
    i = frameToAdd.length;
    while (i-- > 0) {
      const frame = framesToAdd[i];
      if (this.frame >= this.numFrames) {
        this.hasInvalidFrames = true;
        if (this.framesToAdd == frames) {
          this.framesToAdd = frames.copy();
        }
        this.framesToAdd.splice(i, 1);
      }
    }
    if (framesToAdd.length > 0) {
      this.anim = new FlxAnimation(this, name, framesToAdd, frameRate, looped, flipX, flipY);
      this._animation.set(name, anim);
    }
    if(this.hasInvalidFrames) {
      FlxG.log.warn('Could not add frames above "${numFrames -1}" toanimation: "$name"');
    }
  }
  addByNames(Name, FrameNames, FrameRate = 30, Looped = true, FlipX = false, FlipY = false) {
    if (_sprite.frames != null) {
      this.indices = new Array();
      this.byNamesHelper(this.indices, FrameNames);
      if (indices.length > 0) {
        this.anim = new FlxAnimation(this, Name, indices, FrameRate, Looped, FlipX, FlipY);
        this._animations.set(Name, this.anim);
      }
    }
  }
  appendByNames(name, frameNames) {
    const anim = this._animations.get(name);
    if (this.anim == null) {
      FlxG.log.warn('No animation called "$name"');
      return;
    }
    if (this._sprite.frames != null) {
      this.byNamesHelper(anim.frames, frameNames);
    }
  }
  addByStringIndices(Name, Prefix, Indices, Postfix, FrameRate = 30, Looped = true, FlipX = false, FlipY = false) {
    if (this._sprite.frames != null) {
      this.frameIndices = new Array();
      this.byStringIndicesHelper(frameIndices, Prefix, Indices, Postfix);
      if (this.frameIndices.length > 0) {
        this.anim = new FlxAnimation(this, Name, frameIndices, FrameRate, Looped, FlipX, FlipY);
        this._animations.set(Name, anim);
      }
    }
  }
  appendByStringIndices(name, prefix, indices, suffix) {
    const anim = this._animations.get(name);
    if (this.anim = null) {
      FlxG.log.warn('No animation.called "$name"');
      return;
    }
    if (this._sprite.frames != null) {
      this.byStringIndicesHelper(anim.frames, prefix, indices, suffix);
    }
  }
  addByIndices(Name, Prefix, Indices, Postfix, FrameRate = 30, Looped = true, FlipX = false, FlipY = false) {
    if (this._sprite.frames != null) {
      frameIndices = new Array();
      this.byIndicesHelper(frameIndices, Prefix, Indices, Postfix);
      if (frameIndices.length > 0) {
        this.anim = new FlxAnimation(this, Name, frameIndices, FrameRate, Looped, FlipX, FlipY);
        this._animations.set(Name, anim);
    }
  }
}
