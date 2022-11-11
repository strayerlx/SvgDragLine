//=============================================================
//静态数据

let BaseCompArray = ["Number", "Boolean", "String", "Color"]

// 动态数据

let temp_canvas_array = {
    "Number": [],
    "Boolean": [],
    "String": [],
    "Color": []
}

let temp_svg_line_array = []

let mouseoverFlag = false
let Click_Point = null
let C_MouseDom = null

//=============================================================
//创建基础组件

CreateCompArray(document.querySelector(".Comp_Box ul"), BaseCompArray);

function U_CanvasDom(vDom) {
    let button_content = document.createElement("div")
    let button_in = document.createElement("div")
    let button_out = document.createElement("div")

    button_content.className = String("canvas_button_content")
    button_in.className = String("canvas_button_in")
    button_out.className = String("canvas_button_out")

    button_in.innerText = "in"
    button_out.innerText = "out"

    button_content.appendChild(button_in)
    button_content.appendChild(button_out)

    vDom.appendChild(button_content)
}

function createCanvasDom(vDom, e, vDrag) {
    let Temp_Text = document.createElement("p")
    Temp_Text.innerText = e.target.innerText
    vDom.appendChild(Temp_Text)

    // ---------------------------------------------------------------------

    U_CanvasDom(vDom)

    // ---------------------------------------------------------------------

    vDom.className = String("BP_" + e.target.innerText + "_node")
    let temp_num = AddArray(Object.getOwnPropertyDescriptor(temp_canvas_array, String(e.target.innerText)).value)
    vDom.classList.add(String(e.target.innerText + "_box_" + temp_num))
    vDom.classList.add("canvas_dom")

    let vObj_left = Number(String(vDrag.vObj.style.left).replace('px', ''))
    let vObj_top = Number(String(vDrag.vObj.style.top).replace('px', ''))

    let x = vObj_left - document.querySelector(".Canvas_Box").getBoundingClientRect().left - document.documentElement.scrollLeft

    vDom.style.left = x + 'px'
    vDom.style.top = vDrag.vObj.style.top
}

//=============================================================
//组件绑定拖动函数

document.querySelector(".Comp_Box ul").addEventListener('mouseover', function (e) {

    let drag1 = new CompDrag();

    drag1.init(String("." + e.target.className), '.temp_drag_dv1', {
        mDown: function () {
            let Dv1 = document.createElement("div")
            Dv1.className = String("temp_drag_dv1")
            Dv1.innerText = e.target.innerText
            document.querySelector('#app').appendChild(Dv1)
        },
        mUp: function () {
            document.querySelector('.temp_drag_dv1').remove();

            let Dv1 = document.createElement("div")
            createCanvasDom(Dv1, e, drag1)

            document.querySelector('.Canvas_Box').appendChild(Dv1)

            Dv1.children[0].addEventListener('mouseover', Canvas_Dom_Drag)

            Dv1.children[1].children[0].addEventListener('mouseover', CreateSvg)
            Dv1.children[1].children[1].addEventListener('mouseover', CreateSvg)

            Dv1.children[1].children[0].addEventListener('mouseleave', ListenPointOver)
            Dv1.children[1].children[1].addEventListener('mouseleave', ListenPointOver)
        }
    })
})

//=============================================================
//canvas拖动函数

function Canvas_Dom_Drag(e) {
    let temp_class = e.target.parentNode.className.split(" ")

    let drag1 = new CompDrag();

    let S_point_x;
    let S_point_y;
    let F_point_x;
    let F_point_y;
    let temp_Dom = null;

    drag1.init(String("." + temp_class[1] + ' p'), String("." + temp_class[1]), {
        mDown: function () {
            drag1.disX = document.querySelector(".Canvas_Box").getBoundingClientRect().left + document.documentElement.scrollLeft

            if (temp_svg_line_array.length > 0) {
                for (let i = 0; i < temp_svg_line_array.length; i++) {
                    if (temp_svg_line_array[i].split('-')[1] == temp_class[1]) {
                        temp_Dom = temp_svg_line_array[i]
                    }
                }
            }

            if (temp_Dom != null) {
                let temp_d1 = document.querySelector(String('.' + temp_Dom)).classList[0].split('-')[1]
                let temp_d2 = document.querySelector(String('.' + temp_Dom)).classList[1].split('-')[1]

                if (temp_d1 == temp_class[1]) {
                    S_point_x = Number(document.querySelector(String('.' + temp_d2)).style.left.replace('px', ''))
                    S_point_y = Number(document.querySelector(String('.' + temp_d2)).style.top.replace('px', ''))
                } else {
                    S_point_x = Number(document.querySelector(String('.' + temp_d1)).style.left.replace('px', ''))
                    S_point_y = Number(document.querySelector(String('.' + temp_d1)).style.top.replace('px', ''))
                }
            }
        },
        mMove: function () {

            if (temp_Dom != null) {
                F_point_x = Number(document.querySelector(String('.' + temp_class[1])).style.left.replace('px', ''))
                F_point_y = Number(document.querySelector(String('.' + temp_class[1])).style.top.replace('px', ''))

                DrawSvgLine("update", temp_Dom, 'out', S_point_x, S_point_y, F_point_x, F_point_y)
            }


        },
        mUp: function () {
            let temp_left = Number(String(document.querySelector(String("." + temp_class[1])).style.left).replace('px', ''))
            if (temp_left <= 10) {
                document.querySelector(String("." + temp_class[1])).style.left = '10px'
            }
            if (temp_left <= -70) {
                document.querySelector(String("." + temp_class[1])).remove()
                let temp_num = String(temp_class[1]).split("_")
                let temp_index = Object.getOwnPropertyDescriptor(temp_canvas_array, String(e.target.innerText)).value.indexOf(Number(temp_num[2]))
                Object.getOwnPropertyDescriptor(temp_canvas_array, String(e.target.innerText)).value.splice(temp_index, 1)
            }
        }
    }, 60, 12)
}

//=============================================================
//监听可放置点

function ListenPointOver() {
    mouseoverFlag = false
    C_MouseDom = null
}

//=============================================================
//svg 线条

function DrawSvgLine(update_type, update_dom, type, s_x, s_y, f_x, f_y) {
    let P1_x;
    let P1_y = s_y + 35
    let P2_x;
    let P2_y = f_y + 35;

    switch (update_type) {
        case "create":
            let svg_dom = document.querySelector('.Canvas_Box svg');
            let svgNS = "http://www.w3.org/2000/svg";

            function createTag(tag, obj) {
                var oTag = document.createElementNS(svgNS, tag);
                for (var attr in obj) {
                    oTag.setAttribute(attr, obj[attr]);
                }
                return oTag;
            }

            let og = createTag('path', { 'class': update_dom, 'stroke': 'red', 'stroke-width': '3', 'fill': 'none', 'd': 'M0 0 0 0' });
            svg_dom.appendChild(og);
            break;

        case "update":
            if (type === "out") {
                P1_x = s_x + 120
                P2_x = f_x + 50
            }

            if (type === "in") {
                P1_x = s_x
                P2_x = f_x + 70
            }

            let temp_line = String('M' + P1_x + ' ' + P1_y + ' ' + 'C' + P2_x + ' ' + P1_y + ' ' + P1_x + ' ' + P2_y + ' ' + P2_x + ' ' + P2_y)
            document.querySelector(String('.' + update_dom)).setAttribute('d', temp_line)
            break;

        case "delete":
            document.querySelector(String('.' + update_dom)).remove()
            break;

        case "down":
            document.querySelector(String('.' + update_dom)).classList.add(String('svg_line-' + type))
    }
}

function CreateSvg(e) {
    mouseoverFlag = true;
    C_MouseDom = e.target

    let temp_dom = e.target.parentNode.parentNode

    let S_point_x = Number(String(temp_dom.style.left).replace('px', ''))
    let S_point_y = Number(String(temp_dom.style.top).replace('px', ''))

    let drag1 = new CompDrag();

    let temp_line_class_name = String('svg_line-' + temp_dom.classList[1] + '-' + e.target.innerText)

    drag1.init(String("." + temp_dom.classList[1] + ' .' + e.target.className), String('.temp_line_dv1'), {
        mDown: function () {
            let Dv1 = document.createElement("div")

            Dv1.className = String("temp_line_dv1")
            Dv1.innerText = e.target.innerText
            document.querySelector('#app').appendChild(Dv1)

            Click_Point = temp_dom

            if (temp_svg_line_array.indexOf(temp_line_class_name) == -1) {
                temp_svg_line_array.push(temp_line_class_name)
                DrawSvgLine("create", temp_line_class_name, e.target.innerText, 0, 0, 0, 0)

                if (temp_dom.attributes.valueLine !== undefined && temp_dom.attributes.valueLine !== '') {
                    let temp_value = temp_dom.attributes.valueLine.value + '_' + temp_svg_line_array.indexOf(temp_line_class_name)
                    temp_dom.setAttribute('valueLine', temp_value)
                } else {
                    temp_dom.setAttribute('valueLine', temp_svg_line_array.indexOf(temp_line_class_name))
                }
            }
        },
        mMove: function () {
            let vObj_left = Number(String(drag1.vObj.style.left).replace('px', ''))
            let vObj_top = Number(String(drag1.vObj.style.top).replace('px', ''))

            let F_point_x = vObj_left - document.querySelector(".Canvas_Box").getBoundingClientRect().left - document.documentElement.scrollLeft
            let F_point_y = vObj_top

            DrawSvgLine("update", temp_line_class_name, e.target.innerText, S_point_x, S_point_y, F_point_x, F_point_y)
        },
        mUp: function () {
            let F_point_dom = document.querySelector('.temp_line_dv1')
            F_point_dom.remove();
            let temp_index = temp_svg_line_array.indexOf(temp_line_class_name)


            if (mouseoverFlag === false || C_MouseDom.parentNode.parentNode == Click_Point) {
                if (temp_index != -1) {
                    temp_svg_line_array.splice(temp_index, 1)
                    DrawSvgLine("delete", temp_line_class_name)

                    if (temp_dom.attributes.valueLine !== undefined) {
                        let temp_value_arr = temp_dom.attributes.valueLine.value.split('_')
                        if (temp_value_arr.indexOf(temp_index)) {
                            temp_value_arr.splice(temp_value_arr.indexOf(temp_index), 1)

                            if (temp_value_arr == 0) {
                                temp_dom.removeAttribute('valueLine')
                            } else {
                                let temp_string = ''
                                for (let i = 0; i < temp_value_arr.length; i++) {
                                    if (i == 0) {
                                        temp_string = String(temp_value_arr[i])
                                    } else {
                                        temp_string = String(temp_string + '_' + temp_value_arr[i])
                                    }
                                }
                                temp_dom.setAttribute('valueLine', '')
                            }

                        }
                    }
                }
            } else {
                DrawSvgLine("down", temp_line_class_name, String(C_MouseDom.parentNode.parentNode.classList[1] + '-' + C_MouseDom.innerText))
                temp_svg_line_array.push(String('svg_line-' + C_MouseDom.parentNode.parentNode.classList[1] + '-' + C_MouseDom.innerText))
            }


        }
    })
}