(function() {
    var a = {};
    /**
     *
     * @param  {[type]} g        [待载入的资源数组]
     * @param  {[type]} batchNum [每一批同时载入的数目，默认为5]
     * @return {[type]}          [description]
     */
    var loader = function(g, batchNum) {
        this.batchNum = batchNum || 5;
        this._source = [];
        this._completeData = [];
        this.fails = [];
        this._index = 0;
        this.failed = 0;
        this.loaded = 0;
        this.percent = "0%";
        this.completeNum = 0;
        this._init(g);
        this.total = this._source.length;
        var f = this;
        setTimeout(function() {
            //同时请求N个资源
            for (var i = 0; i < f.batchNum; i++) {
                f._load(i);
            }
        }, 25)
    };
    loader.prototype = {
        _rsuffix: /\.(js|css|mp3|module)$/,
        _init: function(f) {
            if (typeof f === "string") this._source.push(f);
            else if (Array.isArray(f)) this._source = f;
            else throw "Loader Error: arguments must be String|Array.";
        },
        _get_load_method: function(g) {
            if (typeof(g) === 'function') {
                return '_funtion';
            } else {
                var f = (f = g.match(this._rsuffix)) ? f[1] : "img";
                return "_" + f
            }
        },
        //支持传入函数
        _funtion: function(action, callback, index) {
            var that = this;
            action(function(data) {
                that._completeData[index] = data;
                callback.call(that, true, action, index);
            });
        },
        _module: function(name, callback, index) {
            var that = this;
            require.async(name.replace(/\.module$/, ""), function(m) {
                that._completeData[index] = m;
                callback.call(that, true, name, index);
            });
        },
        _js: function(h, i, index) {
            var g = this;
            var f = document.createElement("script");
            f.onload = function() {
                i && i.call(g, true, h, index)
            };
            f.onerror = function() {
                i && i.call(g, false, h, index)
            };
            f.type = "text/javascript";
            f.src = h;
            document.head.appendChild(f)
        },
        _css: function(g, h, index) {
            var f = this;
            var i = document.createElement("link");
            i.type = "text/css";
            i.rel = "stylesheet";
            i.href = g;
            document.head.appendChild(i);
            h && h.call(f, true, g, index)
        },
        _img: function(h, i, index) {
            var g = this;
            var f = new Image;
            f.onload = function() {
                a[h] = f;
                setTimeout(function() {
                    i && i.call(g, true, h, index)
                }, 10)
            };
            f.onerror = function() {
                setTimeout(function() {
                    i && i.call(g, false, h, index)
                }, 10)
            };
            f.src = h
        },
        _mp3: function(f, g) {},
        _load: function(index) {
            if (index >= this.total) {
                return;
            }
            var f = this._source[index];
            this._completeData[index] = f;
            var g = this._get_load_method(f);
            this[g](f, this._loadend, index);
            this._onloadstart(f, index);
        },
        _loadend: function(isSuccess, g, index) {
            this.completeNum += 1;
            if (isSuccess) {
                ++this.loaded;
            } else {
                ++this.failed;
                this.fails.push(g);
            }
            //这里的载入进度百分百仅仅用个数来表示
            this.percent = Math.ceil(this.completeNum / this.total * 100) + "%";
            this._onloadend(isSuccess, g, index);

            //如果全部载入完成
            if (this.completeNum >= this.total) {
                this._onend.call(this, this._completeData);
            } else if (index < this.total) {
                //如果还有没执行的任务
                this._load(index + this.batchNum);
            }
        },
        _onloadstart: function() {},
        _onloadend: function() {},
        _onend: function() {},
        loadstart: function(f) {
            if (typeof f === "function") this._onloadstart = f;
            return this
        },
        loadend: function(f) {
            if (typeof f === "function") this._onloadend = f;
            return this
        },
        complete: function(f) {
            if (typeof f === "function") this._onend = f;
            return this
        },
        image: function(g, h) {
            if (arguments.length == 1) {
                if (undefined == g) return a;
                var f = a[g];
                if (f) return f;
                f = new Image;
                f.src = g;
                return f
            }
            if (arguments.length == 2) a[g] = h
        }
    };
    window.Loader = function(resources, batchNum) {
        return new loader(resources, batchNum)
    }
})();