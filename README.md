<h1 style="border-bottom-width: 0">Chrome Please Fix Your Audio</h1>

### [Minimal Reproduction](https://chrome-please-fix-your-audio.xyz) for Chrome bug [#327472528](https://issues.chromium.org/issues/327472528)

In some cases, Chrome subtracts your output audio from your microphone audio input. This is nifty when you're not using headphones in a video call, but can be annoying in other cases. 

The following code is supposed to prevent this issue, but in some Chrome browsers (consistently in ChromeOS) it doesn't:

```js
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  echoCancellation: false,
  noiseSuppression: false,
  autoGainControl: false,
});
```

On my Windows machine, going `chrome://flags` and turning off these settings will prevent the issue:

![flags](https://github.com/lukeschaefer/chrome-please-fix-your-audio/assets/5386710/fb95f52d-b7aa-44b0-afe6-32704df1d6db)

## Test for yourself

Head to https://chrome-please-fix-your-audio.xyz - or clone the repo and run locally with a quick `npm run dev`.

If you're also impacted by [this bug](https://issues.chromium.org/issues/327472528) go ahead and +1 it. Also, shameless plug - if you're wondering why I care so much, it's because I'm working on https://LoopBox.app - a fun little tool to record audio loops in your browser.
