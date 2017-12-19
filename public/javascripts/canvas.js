class Draw {
    constructor(el) {
        this.el = el
        this.canvas = document.getElementById(this.el)
        this.cxt = this.canvas.getContext('2d')
        this.stage_info = canvas.getBoundingClientRect()
        // 记录绘图位点的坐标
        this.path = {
            beginX: 0,
            beginY: 0,
            endX: 0,
            endY: 0
        }
    }
    // 初始化
    init(ws, btn) {
        this.canvas.onmousedown = () => {
            this.drawBegin(event, ws)
        }
        this.canvas.onmouseup = () => {
            this.drawEnd()
            ws.send('stop')
        }
        this.clearCanvas(ws, btn)
    }

    drawBegin(e, ws) {
        window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty()
        this.cxt.strokeStyle = "#000"

        // 开始新的路径（这一句很关键，你可以注释掉看看有什么不同）
        this.cxt.beginPath()
        this.cxt.moveTo(
            e.clientX - this.stage_info.left,
            e.clientY - this.stage_info.top
        )
        // 记录起点
        this.path.beginX = e.clientX - this.stage_info.left
        this.path.beginY = e.clientY - this.stage_info.top

        document.onmousemove = () => {
            this.drawing(event, ws)
        }
    }

    drawing(e, ws) {
        this.cxt.lineTo(
            e.clientX - this.stage_info.left,
            e.clientY - this.stage_info.top
        )
        // 记录终点
        this.path.endX = e.clientX - this.stage_info.left
        this.path.endY = e.clientY - this.stage_info.top
        // 把位图坐标发送到服务器
        ws.send(this.path.beginX + '.' + this.path.beginY + '.' + this.path.endX + '.' + this.path.endY)

        this.cxt.stroke()
    }

    drawEnd() {
        document.onmousemove = document.onmouseup = null
    }

    clearCanvas(ws, btn) {
        // 点击按钮清空画布
        btn.onclick = () => {
            this.cxt.clearRect(0, 0, 500, 500)
            ws.send('clear')
        }
    }
}
