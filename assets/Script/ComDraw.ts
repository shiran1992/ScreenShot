const { ccclass, property } = cc._decorator;

@ccclass
export default class ComDraw extends cc.Component {

    public graphics: cc.Graphics;

    public posArr: cc.Vec2[][] = []; //绘制内容坐标
    public boardPosArr: cc.Vec2[] = []; //边框坐标

    public successCall = null;
    public errorCall = null;

    onLoad() {
        this.graphics = this.node.addComponent(cc.Graphics);

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    /**
     * 设置回调
     * @param success 
     * @param error 
     */
    public setCallbacks(success, error): void {
        this.successCall = success;
        this.errorCall = error;
    }

    /**
     * 触摸开始
     */
    public curPosArr: cc.Vec2[] = [];
    public onTouchStart(event): void {

        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        let wPos: cc.Vec2 = new cc.Vec2(event.getLocationX(), event.getLocationY());
        let lPos: cc.Vec2 = this.node.convertToNodeSpaceAR(wPos);
        this.graphics.moveTo(lPos.x, lPos.y);

        this.curPosArr = [lPos];
    }

    /**
     * 拖动
     */
    public onTouchMove(event): void {
        let wPos: cc.Vec2 = new cc.Vec2(event.getLocationX(), event.getLocationY());
        let lPos: cc.Vec2 = this.node.convertToNodeSpaceAR(wPos);

        this.curPosArr.push(lPos);
        if (this.graphics) {
            this.graphics.lineTo(lPos.x, lPos.y);
            this.graphics.lineWidth = 5;
            this.graphics.strokeColor = new cc.Color().fromHEX("#FBCF2E");
            this.graphics.stroke();
        }
    }

    /**
     * 触摸结束
     */
    public timer = null;
    public onTouchEnd(): void {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        this.posArr.push(this.curPosArr.concat([]));
        this.curPosArr = [];

        this.timer = setTimeout(() => {
            /*this.boardPosArr.push(cc.v2(-this.node.width / 2, this.node.height / 2));
            this.boardPosArr.push(cc.v2(-this.node.width / 2, -this.node.height / 2));
            this.boardPosArr.push(cc.v2(this.node.width / 2, -this.node.height / 2));
            this.boardPosArr.push(cc.v2(this.node.width / 2, this.node.height / 2));

            let wBoardPosArr = this.boardPosArr.map((e) => {
                let wPos: cc.Vec2 = e.add(cc.v2(this.node.width / 2, this.node.height / 2));
                wPos.y = this.node.height - wPos.y;
                return wPos.x + "_" + wPos.y;
            });

            let wDrawPosArr = this.posArr.map((arr) => {
                return arr.map((e) => {
                    let wPos: cc.Vec2 = e.add(cc.v2(this.node.width / 2, this.node.height / 2));
                    wPos.y = this.node.height - wPos.y;
                    return wPos.x + "_" + wPos.y;
                })
            });
            lyx_bridge.transformPos(wBoardPosArr, wDrawPosArr,
                (w) => {
                    this.posArr = [];
                    if (this.graphics) {
                        this.graphics.clear();
                    }

                    cc.log("识别结果----", w);

                    this.successCall && this.successCall(w);
                }, (e) => {
                    if (this.graphics) {
                        this.graphics.clear();
                    }
                    cc.log("失败----", e);

                    this.errorCall && this.errorCall(e);
                });*/
                //this.onClickSave();
        }, 500);
    }

    /**
	 * 点击保存
	 */
	/*public onClickSave(): void {
		
		let camera = cc.find("camera", this.node.parent).getComponent(cc.Camera);
        

        this.node.parent.getChildByName("camera");

		// 设置你想要的截图内容的 cullingMask
		camera.cullingMask = 0xffffffff;
		camera.alignWithScreen = false;
		camera.orthoSize = 500;

		// 新建一个 RenderTexture，并且设置 camera 的 targetTexture 为新建的 RenderTexture，这样 camera 的内容将会渲染到新建的 RenderTexture 中。
		let texture = new cc.RenderTexture();
		let gl = cc.game._renderContext;
		// 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数
		texture.initWithSize(1000, 1000, gl.STENCIL_INDEX8);
		camera.targetTexture = texture;

		// 渲染一次摄像机，即更新一次内容到 RenderTexture 中
		camera.render();

		// 这样我们就能从 RenderTexture 中获取到数据了
		let data = texture.readPixels();

		// 接下来就可以对这些数据进行操作了
		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');
		let width = canvas.width = texture.width;
		let height = canvas.height = texture.height;

		canvas.width = texture.width;
		canvas.height = texture.height;

		let rowBytes = width * 4;
		for (let row = 0; row < height; row++) {
			let srow = height - 1 - row;
			let imageData = ctx.createImageData(width, 1);
			let start = srow * width * 4;
			for (let i = 0; i < rowBytes; i++) {
				imageData.data[i] = data[start + i];
			}

			ctx.putImageData(imageData, 0, row);
		}

		let dataURL = canvas.toDataURL("image/jpeg");
		cc.log("5555555555", dataURL);
	}*/

	public flipY(data: any[] | Uint8Array, w: number, h: number, uw: number) {
		for (let i = 0; i < h / 2; i++) {
			let i1 = i;
			let i2 = h - i - 1;
			let temp: number;
			for (let j = 0; j < w * uw; j++) {
				temp = data[i1 * w * uw + j];
				data[i1 * w * uw + j] = data[i2 * w * uw + j];
				data[i2 * w * uw + j] = temp;
			}
		}
	}
}
