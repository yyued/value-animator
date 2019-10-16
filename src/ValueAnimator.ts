export class ValueAnimator {

    static currentTimeMillsecond: () => number = () => {
        if (typeof performance === "undefined") {
            return new Date().getTime()
        }
        return performance.now()
    }

    static requestAnimationFrame: (callback: () => void) => any = (callback) => {
        if (typeof requestAnimationFrame === "undefined") {
            return setTimeout(callback, 16)
        }
        return window.requestAnimationFrame(callback)
    }

    public requestAnimationFrame: any
    public startValue: number = 0
    public endValue: number = 0
    public duration: number = 0
    public loops: number = 1
    public fillRule: number = 0

    public onStart: () => void = () => { }
    public onUpdate: (currentValue: number) => void = () => { }
    public onEnd: () => void = () => { }

    public start(currentValue: number | undefined = undefined) {
        this.doStart(false, currentValue)
    }

    public reverse(currentValue: number | undefined = undefined) {
        this.doStart(true, currentValue)
    }

    public stop() {
        this.doStop()
    }

    public get animatedValue(): number {
        return ((this.endValue - this.startValue) * this.mCurrentFrication) + this.startValue
    }

    private mRunning = false
    private mStartTime = 0
    private mCurrentFrication: number = 0.0
    private mReverse = false

    private doStart(reverse: boolean = false, currentValue: number | undefined = undefined) {
        this.mReverse = reverse
        this.mRunning = true
        this.mStartTime = ValueAnimator.currentTimeMillsecond()
        if (currentValue) {
            if (reverse) {
                this.mStartTime -= (1.0 - currentValue / (this.endValue - this.startValue)) * this.duration
            }
            else {
                this.mStartTime -= currentValue / (this.endValue - this.startValue) * this.duration
            }
        }
        this.mCurrentFrication = 0.0
        this.onStart()
        this.doFrame()
    }

    private doStop() {
        this.mRunning = false
    }

    private doFrame() {
        if (this.mRunning) {
            this.doDeltaTime(ValueAnimator.currentTimeMillsecond() - this.mStartTime)
            if (this.mRunning) {
                if (requestAnimationFrame !== undefined) {
                    requestAnimationFrame(this.doFrame.bind(this))
                }
                else {
                    ValueAnimator.requestAnimationFrame(this.doFrame.bind(this))
                }
            }
        }
    }

    private doDeltaTime(deltaTime: number) {
        if (deltaTime >= this.duration * this.loops) {
            this.mCurrentFrication = this.fillRule === 1 ? 0.0 : 1.0
            this.mRunning = false
        }
        else {
            this.mCurrentFrication = (deltaTime % this.duration) / this.duration
            if (this.mReverse) {
                this.mCurrentFrication = 1.0 - this.mCurrentFrication
            }
        }
        this.onUpdate(this.animatedValue)
        if (this.mRunning === false) {
            this.onEnd()
        }
    }

}