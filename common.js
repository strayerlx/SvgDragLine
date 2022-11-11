//=============================================================
//基本函数

function CreateCompArray(_document, _arr) {
    _arr.forEach((val, i, arr) => {
        let ChildDiv = document.createElement("div")

        ChildDiv.className = String("child-" + i)
        ChildDiv.innerText = val

        _document.appendChild(ChildDiv)
    })
}

function AddArray(arr) {
    arr.sort();
    if (arr.length === 0) {
        arr.push(0)
        return 0
    } else {
        for (let i = 0; i <= arr[arr.length - 1] + 1; i++) {
            if (arr.indexOf(i) == -1) {
                arr.push(i)
                arr.sort();
                return i
            }
        }
    }

}

//=============================================================
//拖拽函数

function extend(obj1, obj2) {
    for (var attr in obj2) {
        obj1[attr] = obj2[attr]
    }
}

function CompDrag() {
    this.obj = null;
    this.vObj = null
    this.disX = 0;
    this.disY = 0;
    this.flag = false
    this.D_top = 25;
    this.D_width = 60;

    this.settings = {
        mDown: function () {

        },
        mMove: function () {

        },
        mUp: function () {

        }
    };
}

CompDrag.prototype.init = function (id, vDrag, opt, H_width, H_top) {
    extend(this.settings, opt)

    if (H_width !== undefined) {
        this.D_top = H_top;
    }
    if (H_top !== undefined) {
        this.D_width = H_width;
    }

    this.obj = document.querySelector(id);
    let _this = this;

    _this.obj.onmousedown = function (e) {
        _this.flag = true
        var e = e || window.event

        _this.settings.mDown();

        if (vDrag === undefined) {
            vDrag = id
        } else {
            _this.vObj = document.querySelector(vDrag)
        }

        _this.mDown(e);

        document.onmousemove = function (e) {
            var e = e || window.event;
            _this.settings.mMove();
            _this.mMove(e);
        }
        document.onmouseup = function () {
            _this.settings.mUp();
            _this.mUp();
        }
    }
}

CompDrag.prototype.mDown = function (e) {
    this.vObj.style.left = e.clientX + document.documentElement.scrollLeft - this.disX - this.D_width + 'px';
    this.vObj.style.top = e.clientY + document.documentElement.scrollTop - this.disY - this.D_top + 'px';
}

CompDrag.prototype.mMove = function (e) {
    if (this.flag === true) {
        this.vObj.style.left = e.clientX + document.documentElement.scrollLeft - this.disX - this.D_width + 'px';
        this.vObj.style.top = e.clientY + document.documentElement.scrollTop - this.disY - this.D_top + 'px';
    }
}

CompDrag.prototype.mUp = function () {
    this.flag = false
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
}

//=============================================================
//连线函数