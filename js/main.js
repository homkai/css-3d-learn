/**
 *  动画控制文件
 * 依赖
 *  images.data.js图片定义
 *  C3D https://github.com/shrekshrek/css3d-engine
 *  JSTween https://github.com/shrekshrek/jstween/blob/master/doc/jstween.md
 * 温馨提示
 *  对照images.data.js图片定义来阅读代码
 */
$(function () {
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;

    // 场景准备
    function scene0() {
        window.the = this;
        $('#world').empty();
        var $stage = $('#world');
        this.stage = new C3D.Stage();
        this.stage.size(WIDTH, HEIGHT).update();
        $stage.append(this.stage.el);

        this.main = new C3D.Sprite();
        this.main.position(0, 0, -750).update();
        this.stage.addChild(this.main);
    }

    // 第一幕，元素准备
    function scene1() {
        this.s1 = new C3D.Sprite();
        this.s1.position(0, 0, -1).update();

        this.s1_bg = new C3D.Plane();
        this.s1_bg.size(IMG.s1_bg.width, IMG.s1_bg.height).scale(1.3).position(0, 0, 0).material({
            image: IMG.s1_bg.src
        }).update();
        this.s1.addChild(this.s1_bg);

        this.s1_top = new C3D.Plane();
        this.s1_top.size(IMG.s1_top.width, IMG.s1_top.height).scale(.8).position(0, -50, 199).rotation(0, 0, 0).material({
            image: IMG.s1_top.src
        }).update();
        this.s1.addChild(this.s1_top);

        this.s1_man = new C3D.Plane();
        this.s1_man.size(IMG.s1_man.width * 8, IMG.s1_man.height * 8).position(2, 3200, 200).material({
            image: IMG.s1_man.src
        }).update();
        this.s1.addChild(this.s1_man);

        this.s1_btm = new C3D.Plane();
        this.s1_btm.size(IMG.s1_btm.width, IMG.s1_btm.height).scale(.72).material({
            image: IMG.s1_btm.src
        }).update();

        this.s1_playTip = new C3D.Plane();
        this.s1_playTip.size(IMG.s1_playTip.width, IMG.s1_playTip.height).position(-5, 385, 201).rotation(0, 0, 0).scale(.35).material({
            image: IMG.s1_playTip.src
        }).update();
    }

    // 飞舞效果
    function flys(ctn) {
        var flowers = IMG.fly;
        var fiedZ = 310;
        var fixedPst = [
            // 右下
            {
                x: 160,
                y: 215,
                z: fiedZ,
                rx: 0,
                ry: 0,
                rz: 0
            },
            // 左下
            {
                x: -100,
                y: 163,
                z: fiedZ,
                rx: 0,
                ry: 0,
                rz: -20
            },
            // 右上
            {
                x: 170,
                y: -285,
                z: fiedZ,
                rx: 0,
                ry: 0,
                rz: 0
            },
            // 左上
            {
                x: -190,
                y: -45,
                z: fiedZ,
                rx: 0,
                ry: 0,
                rz: 0
            }
        ];
        var fly = function (view) {
            var x = view.fixed ? fixedPst[view.fixed - 1].x : 1000 * Math.random() - 500,
                y = view.fixed ? fixedPst[view.fixed - 1].y : 1200 * Math.random() - 900,
                z = view.fixed ? fixedPst[view.fixed - 1].z : 100 * Math.random() + 250,
                rx = view.fixed ? fixedPst[view.fixed - 1].rx : 1440 * Math.random() - 720,
                ry = view.fixed ? fixedPst[view.fixed - 1].ry : 1440 * Math.random() - 720,
                rz = view.fixed ? fixedPst[view.fixed - 1].rz : 0;
            !view.fixed && JT.to(view, 3, {
                alpha: 0,
                ease: JT.Quad.In,
                onUpdate: function() {
                    view.updateV();
                }
            });
            JT.to(view, 3, {
                x: x,
                y: y,
                z: z,
                rotationX: rx,
                rotationY: ry,
                rotationZ: rz,
                ease: JT.Expo.Out,
                onUpdate: function() {
                    view.updateT();
                },
                onEnd: function() {
                    !view.fixed && view.destroy()
                }
            });
        };
        for (var i = 0; i < 20; i++) {
            var view = new C3D.Plane();
            var cur = i % flowers.length;
            i < 4 && (view.fixed = i + 1);
            view.position(0, 300, 201).size(flowers[cur].width, flowers[cur].height).scale(view.fixed ? .6 : .2 * Math.random() + .3).material({
                image: flowers[cur].src
            }).update();
            ctn.addChild(view);
            fly(view);
        }
    }

    // 第一幕，动画
    function act1() {
        var me = this;
        me.main.addChild(me.s1);
        // 人由大到小
        JT.to(me.s1_man, 1, {
            y: 110,
            width: IMG.s1_man.width * .77,
            height: IMG.s1_man.height * .77,
            ease: JT.Expo.Out,
            onUpdate: function() {
                me.s1_man.updateT();
                me.s1_man.updateS();
            }
        });
        JT.call(1.1, function () {
            // 底部文字砸入效果
            me.s1.addChild(me.s1_btm);
            JT.fromTo(me.s1_btm, .2, {
                rotationZ: 45,
                x:0,
                y: -100,
                z: 1000
            }, {
                rotationZ: 0,
                x:0,
                y: 310,
                z: 201,
                onUpdate: function () {
                    me.s1_btm.updateT()
                },
                onEnd: function () {
                    // 屏幕震动效果
                    JT.to(me.stage.camera, .05, {
                        x: 5,
                        delay: .1,
                        ease: JT.Back.Out,
                        onUpdate: function () {
                            me.stage.updateT()
                        },
                        onEnd: function () {
                            JT.to(me.stage.camera, .05, {
                                x: -5,
                                ease: JT.Back.Out,
                                onUpdate: function () {
                                    me.stage.updateT();
                                },
                                onEnd: function () {
                                    JT.to(me.stage.camera, .1, {
                                        x: 0,
                                        ease: JT.Elastic.Out,
                                        onUpdate: function () {
                                            me.stage.updateT();
                                        },
                                        onEnd: function () {
                                            JT.call(2, function () {
                                                showPlayTip();
                                            });
                                        }
                                    });
                                    // 钞票飞舞
                                    flys(me.s1);
                                }
                            })
                        }
                    });
                }
            });
        });
    }

    // 播放提示
    function showPlayTip() {
        var me = this;
        me.s1.addChild(me.s1_playTip);
        JT.fromTo(me.s1_playTip, 1.5, {
            alpha: .8,
            y: 395
        }, {
            alpha: 0,
            y: 380,
            repeat: -1,
            ease: JT.Sine.InOut,
            onUpdate: function () {
                me.s1_playTip.updateV();
                me.s1_playTip.updateT();
            }
        });
        // 绑定事件
        // 禁止iPhone上图像滑出
        $('body').one('touchmove', function (e) {
            e.preventDefault();
        });
        $('body').one('touchend', function () {
            JT.kill(me.s1_playTip);
            me.main.addChild(me.s2);
            JT.to(me.s1, .3, {
                y: -1500,
                onUpdate: function () {
                    me.s1.updateT();
                },
                onEnd: function () {
                    me.main.removeChild(me.s1);
                    act2();
                }
            });
        });
    }

    // 第二幕
    function scene2() {
        var textScale = .65;
        this.s2 = new C3D.Plane();
        this.s2.position(0, 0, -3).update();
        this.s2.bg = this.s2_bg1 = new C3D.Plane();
        this.s2_bg1.size(IMG.s2_bg1.width, IMG.s2_bg1.height).scale(1.3).position(0, 0, -2).material({
            image: IMG.s2_bg1.src
        }).update();
        this.s2.addChild(this.s2_bg1);
        this.s2_bg2 = new C3D.Plane();
        this.s2_bg2.size(IMG.s2_bg2.width, IMG.s2_bg2.height).scale(1.3).position(0, 0, 0).material({
            image: IMG.s2_bg2.src
        }).visibility({
            alpha: 0
        }).update();
        this.s2.addChild(this.s2_bg2);
        this.s2_bg3 = new C3D.Plane();
        this.s2_bg3.size(IMG.s2_bg3.width, IMG.s2_bg3.height).scale(4).position(0, 0, 0).material({
            image: IMG.s2_bg3.src
        }).visibility({
            alpha: 0
        }).update();
        this.s2.addChild(this.s2_bg3);

        this.s2_t1 = new C3D.Plane();
        this.s2_t1.position(0, 0, 100).update();
        this.s2_t1_t = new C3D.Plane();
        this.s2_t1_t.position(0, 0, 200).size(IMG.s2_t1_t.width, IMG.s2_t1_t.height).scale(textScale).material({
            image: IMG.s2_t1_t.src
        }).update();
        this.s2_t1.addChild(this.s2_t1_t);
        this.s2_t1_c = new C3D.Plane();
        this.s2_t1_c.position(0, 0, 201).size(IMG.s2_t1_c.width, IMG.s2_t1_c.height).scale(textScale).material({
            image: IMG.s2_t1_c.src
        }).update();
        this.s2_t1.addChild(this.s2_t1_c);

        this.s2_t2 = new C3D.Plane();
        this.s2_t2.position(0, 0, 100).update();
        this.s2_t2_t = new C3D.Plane();
        this.s2_t2_t.position(0, 0, 200).size(IMG.s2_t2_t.width, IMG.s2_t2_t.height).scale(textScale).material({
            image: IMG.s2_t2_t.src
        }).update();
        this.s2_t2.addChild(this.s2_t2_t);
        this.s2_t2_c = new C3D.Plane();
        this.s2_t2_c.position(0, 0, 201).size(IMG.s2_t2_c.width, IMG.s2_t2_c.height).scale(textScale).material({
            image: IMG.s2_t2_c.src
        }).update();
        this.s2_t2.addChild(this.s2_t2_c);

        this.s2_t3 = new C3D.Plane();
        this.s2_t3.position(0, 0, 100).update();
        this.s2_t3_t = new C3D.Plane();
        this.s2_t3_t.position(0, -10, 200).size(IMG.s2_t3_t.width, IMG.s2_t3_t.height).scale(textScale + .02).material({
            image: IMG.s2_t3_t.src
        }).update();
        this.s2_t3.addChild(this.s2_t3_t);
        this.s2_t3_c = new C3D.Plane();
        this.s2_t3_c.position(0, 0, 201).size(IMG.s2_t3_c.width, IMG.s2_t3_c.height).scale(textScale + .02).material({
            image: IMG.s2_t3_c.src
        }).update();
        this.s2_t3.addChild(this.s2_t3_c);

        this.s2_t4 = new C3D.Plane();
        this.s2_t4.position(0, 0, 100).update();
        this.s2_t4_p = new C3D.Plane();
        this.s2_t4_p.position(0, 0, 200).size(IMG.s2_t4_p.width, IMG.s2_t4_p.height).scale(.6).material({
            image: IMG.s2_t4_p.src
        }).update();
        this.s2_t4.addChild(this.s2_t4_p);
        this.s2_t4_t = new C3D.Plane();
        this.s2_t4_t.position(0, -10, 201).size(IMG.s2_t4_t.width, IMG.s2_t4_t.height).scale(.5).material({
            image: IMG.s2_t4_t.src
        }).update();
        this.s2_t4.addChild(this.s2_t4_t);

        this.s2_m = new C3D.Plane();
        this.s2_m.position(430, 80, 300).size(IMG.s2_m.width, IMG.s2_m.height).scale(1).rotation(0, 0, 50).material({
            image: IMG.s2_m.src
        }).update();
    }

    function act2Roll(viewIn, viewOut, viewBg, delayCb, delayTime) {
        var me = this;
        JT.fromTo(viewIn, .2, {
            rotationX: 0
        }, {
            rotationX: 90,
            ease: JT.Quad.In,
            onUpdate: function () {
                viewIn.updateT()
            },
            onEnd: function() {
                me.s2.removeChild(viewIn);
                me.s2.bg.visibility({
                    alpha: 0
                }).updateV();
                viewBg.visibility({
                    alpha: 1
                }).updateV();
                me.s2.bg = viewBg;
                me.s2.addChild(viewOut);
                JT.fromTo(viewOut, .7, {
                    rotationY: -90
                }, {
                    rotationY: 0,
                    ease: JT.Elastic.Out,
                    onUpdate: function() {
                        viewOut.updateT()
                    },
                    onEnd: function () {
                        JT.call(delayTime, function () {
                            delayCb && delayCb();
                        });
                    }
                });
            }
        });
    }

    function act2T3ToT4() {
        var me = this;
        JT.fromTo(me.s2_t3, .2, {
            rotationX: 0
        }, {
            rotationX: 90,
            ease: JT.Quad.In,
            onUpdate: function() {
                me.s2_t3.updateT()
            },
            onEnd: function() {
                me.s2.removeChild(me.s2_t3);
                me.s2_bg1.visibility({
                    alpha: 0
                }).updateV();
                me.s2_bg3.visibility({
                    alpha: 1
                }).updateV();
                me.s2.addChild(me.s2_t4);
                JT.fromTo(me.s2_t4_t, .2, {
                    rotationY: -90
                }, {
                    rotationY: 0
                });
                JT.fromTo(me.s2_t4_t, 3, {
                    z: 101
                }, {
                    z: 300,
                    ease: JT.Expo.Out,
                    onUpdate: function() {
                        me.s2_t4_t.updateT()
                    },
                    onEnd: function () {
                        JT.to(me.s2_t4, 3, {
                            alpha: 0,
                            ease: JT.Expo.InOut,
                            onUpdate: function() {
                                me.s2_t4.updateV()
                            }
                        });
                        me.s2.addChild(me.s2_m);
                        JT.to(me.stage.camera, 2, {
                            x: 430,
                            y: 80,
                            z: 230,
                            rotationZ: 50,
                            ease: JT.Expo.InOut,
                            onUpdate: function() {
                                me.stage.updateT()
                            },
                            onEnd: function () {
                            }
                        });
                        JT.call(1.5, function() {

                            me.main.removeChild(me.s2);
                            JT.kill(me.stage.camera);
                            me.stage.camera.position(0, 0, 0).rotation(0, 0, 0).updateT();
                            act3();
                        });
                    }
                });
                JT.fromTo(me.s2_t4_p, 5, {
                    z: 101
                }, {
                    z: 260,
                    ease: JT.Expo.Out,
                    onUpdate: function() {
                        me.s2_t4_p.updateT()
                    }
                });
            }
        });
    }

    // 第二幕动画
    function act2() {
        var me = this;
        var delay = .3;
        me.s2.addChild(me.s2_t1);
        JT.fromTo(me.s2_t1, .8, {
            rotationX: -90
        }, {
            rotationX: 0,
            ease: JT.Elastic.Out,
            onUpdate: function () {
                me.s2_t1.updateT()
            },
            onEnd: function () {
                JT.call(delay, function () {
                    act2Roll(me.s2_t1, me.s2_t2, me.s2_bg2, function () {
                        act2Roll(me.s2_t2, me.s2_t3, me.s2_bg1, function () {
                            act2T3ToT4();
                        }, delay);
                    }, delay);
                });
            }
        });
    }

    // 第三幕
    function scene3() {
        this.s3 = new C3D.Plane();
        this.s3.position(0, 0, 0).update();

        this.s3_bg = new C3D.Plane();
        this.s3_bg.size(IMG.s2_bg3.width, IMG.s2_bg3.height).position(0, 0, 0).material({
            image: IMG.s2_bg3.src
        }).scale(5).update();
        this.s3.addChild(this.s3_bg);

        this.s3_m = new C3D.Plane();
        this.s3_m.size(IMG.s2_m.width, IMG.s2_m.height).position(0, 0, 200).material({
            image: IMG.s2_m.src
        }).scale(.83).update();

        this.s3_r1 = new C3D.Plane();
        this.s3_r1.size(IMG.s3_r1.width, IMG.s3_r1.height).position(0, 0, 200).material({
            image: IMG.s3_r1.src
        }).scale(.88).update();

        this.s3_r2 = new C3D.Plane();
        this.s3_r2.size(IMG.s3_r2.width, IMG.s3_r2.height).position(0, 0, 200).material({
            image: IMG.s3_r2.src
        }).scale(.88).update();

        var scale = .5;
        this.s3_e = new C3D.Plane();
        this.s3_e.position(0, 0, 198).update();
        this.s3_e_bg = new C3D.Plane();
        this.s3_e_bg.size(IMG.s3_e_bg.width, IMG.s3_e_bg.height).scale(.57).position(0, 0, 199).material({
            image: IMG.s3_e_bg.src
        }).update();
        this.s3_e.addChild(this.s3_e_bg);
        this.s3_e_c = new C3D.Plane();
        this.s3_e_c.size(IMG.s3_e_c.width, IMG.s3_e_c.height).position(0, 0, 200).material({
            image: IMG.s3_e_c.src
        }).scale(scale).update();
        this.s3_e.addChild(this.s3_e_c);
        this.s3_e_btn1 = new C3D.Plane();
        this.s3_e_btn1.size(IMG.s3_e_btn1.width, IMG.s3_e_btn1.height).position(0, -137, 201).material({
            image: IMG.s3_e_btn1.src
        }).scale(scale).update();
        $(this.s3_e_btn1.el).addClass('show-page').data('page', 1);
        this.s3_e.addChild(this.s3_e_btn1);
        this.s3_e_btn2 = new C3D.Plane();
        this.s3_e_btn2.size(IMG.s3_e_btn2.width, IMG.s3_e_btn2.height).position(0, 0, 201).material({
            image: IMG.s3_e_btn2.src
        }).scale(scale).update();
        $(this.s3_e_btn2.el).addClass('show-page').data('page', 2);
        this.s3_e.addChild(this.s3_e_btn2);
        this.s3_e_btn3 = new C3D.Plane();
        this.s3_e_btn3.size(IMG.s3_e_btn3.width, IMG.s3_e_btn3.height).position(0, 137, 201).material({
            image: IMG.s3_e_btn3.src
        }).scale(scale).update();
        $(this.s3_e_btn3.el).addClass('show-page').data('page', 3);
        this.s3_e.addChild(this.s3_e_btn3);
    }

    // 开始晃动
    function shock() {
        var main = this.main;
        JT.kill(main);
        main.position(0, 0, -750).rotation(0, 0, 0).updateT();
        JT.fromTo(main, .4, {
            x: -5
        }, {
            x: 5,
            yoyo: true,
            repeat: -1,
            onUpdate: function() {
                main.updateT()
            }
        });
        JT.fromTo(main, .34, {
            y: -5
        }, {
            y: 5,
            yoyo: true,
            repeat: -1,
            onUpdate: function() {
                main.updateT()
            }
        });
    }

    // 停止晃动
    function shockOff() {
        JT.kill(this.main);
        this.main.position(0, 0, -750).rotation(0, 0, 0).updateT();
    }

    // 图片切换
    function act3Roll (viewIn, viewOut, delayCb, delayTime) {
        var me = this;
        // 准备镜头
        JT.to(me.stage.camera, .4, {
            z: 2e3,
            ease: JT.Quad.Out,
            onUpdate: function () {
                me.stage.updateT()
            },
            onEnd: function () {
                JT.to(me.stage.camera, .4, {
                    z: 0,
                    ease: JT.Quad.In,
                    onUpdate: function () {
                        me.stage.updateT()
                    }
                })
            }
        });
        // 切换
        JT.fromTo(viewIn, .4, {
            rotationY: 0
        }, {
            rotationY: 90,
            ease: JT.Quad.In,
            onUpdate: function () {
                viewIn.updateT()
            },
            onEnd: function () {
                me.s3.removeChild(viewIn);
                me.s3.addChild(viewOut);
                JT.fromTo(viewOut, .4, {
                    rotationY: -90
                }, {
                    rotationY: 0,
                    ease: JT.Quad.Out,
                    onUpdate: function () {
                        viewOut.updateT()
                    }
                });
                JT.call(delayTime || 0, delayCb);
            }
        });
    }

    // 第三幕 动画
    function act3() {
        var delayTime = 1.5;
        shock();
        var me = this;
        me.main.addChild(me.s3);
        me.s3.addChild(me.s3_m);
        JT.fromTo(me.s3_m, .1, {
            alpha: 0
        }, {
            alpha: 1,
            yoyo: true,
            repeat: 4,
            onUpdate: function() {
                me.s3_m.updateV()
            },
            onEnd: function () {
                act3Roll(me.s3_m, me.s3_r1, function () {
                    act3Roll(me.s3_r1, me.s3_r2, function () {
                        act3Roll(me.s3_r2, me.s3_e, function() {
                            shockOff();
                        });
                    }, delayTime);
                }, delayTime);
            }
        });
    }

    // 职位详情页部分
    function showPage(num){
        var img = IMG['page_' + num];
        var nav = IMG['page_' + num + '_nav'];
        if (!(num - 0)) {
            $('#page').hide();
            $('#world').show();
            return;
        }
        $(window).scrollTop(0);
        $('#page-nav').css({
            width: nav.width,
            height: nav.height,
            backgroundImage: 'url(' + nav.src + ')'
        });
        $('#page-img').css({
            width: img.width,
            height: img.height,
            backgroundImage: 'url(' + img.src + ')',
            marginBottom: nav.height
        });
        $('#world').hide();
        $('#page').show();
        $('.page-link').remove();
        var tpl = '<a class="show-page page-link" data-page="{index}" style="width:{width}px;height:{height}px;bottom:0;left:{left}px"></a>';
        $('#page-nav').append([0, 1, 2, 3].map(function (item) {
            return tpl.replace(/\{(\w+)\}/g, function (m0, m1) {
                switch (m1){
                    case 'index':
                        return item;
                    case 'width':
                        return nav['linkWidth_' + item];
                    case 'height':
                        return nav.height;
                    case 'left':
                        var left = 0;
                        if (item) {
                            for(var i = 0; i < item; i++){
                                left += nav['linkWidth_' + i];
                            }
                        }
                        return left;
                }
            });
        }).join(''));
    }

    function initEvents() {
        $('body').on('tap', '.show-page', function () {
            showPage($(this).data('page'));
        });
    }

    function preload (cb) {
        var imgs = [];
        var addImg = function (item) {
            !item.postload && imgs.push(item.src);
        };
        // 加载动画图片
        $.each(IMG, function (k, v) {
            if (Array.isArray(v)) {
                v.forEach(addImg);
            }
            else {
                addImg(v);
            }
        });
        Loader(imgs).complete(function() {
            $('#loading').hide();
            cb && cb();
        });
    }

    function postload(cb) {
        var imgs = [];
        $.each(IMG, function (k, v) {
            v.postload && imgs.push(v.src);
        });
        Loader(imgs).complete(function() {
            cb && cb();
        });
    }

    function init() {
        initEvents();
        preload(function () {
            // 初始化动画
            scene0();
            scene1();
            scene2();
            scene3();
            act1();
            // 加载职位列表图片
            setTimeout(function () {
                postload();
            }, 5000);
        });
    }

    init();

});