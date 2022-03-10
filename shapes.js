var shapes=[];  // lưu các dấu chấm

    var v_code =
    'attribute vec2 _xy;' +
    'uniform vec2 _size;' +
    'void main() {' +
    'gl_Position = vec4(((_xy/size) * 2.0 - 1.0) * vec2(1, -1), 0, 1.0);' +
    'gl_PointSize = 20.0;' +
    '}';

    var f_code =
    'precision mediump float;' +
    'uniform vec3 _color;' +
    'void main() {' +
    'float d = distance(gl_PointCoord, vec2(0.5, 0.5));' +
    'if(d < 0.5) { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); } else { discard; } ' +
    '}' ;

    function main()
    {
        canv = document.getElementById('myCanvas1');
        gl = canv.getContext('experimental-webgl');

        p = initShader( gl, v_code, f_code);

        color = gl.getUniformLocation(p, "_color");

        var xy = gl.getAttribLocation(p, '_xy');

        var size = gl.getUniformLocation(p, "_size");
        gl.uniform2f(size, canv.width, canv.height);

        //canv.onmousedown=function(e){mdown(e, xy)}
        shapes.push( [50,50, -0.4, 0.4] );
        colors.push( [Math.random(), Math.random(), Math.random()] );
        anim();
    }

    function anim()
    {
        draw();
        window.webkitRequestAnimationFrame(anim);
    }

    function mdown(e )
    {
        var x = e.clientX, y = e.clientY;
        var sx = Math.random()*2-1;
        var sy = Math.random()*2-1;
        shapes.push( [x,y,sx,sy] );
        colors.push( [Math.random(), Math.random(), Math.random()] );
    }

    function draw()
    {
        var len = shapes.length;
        for(var i = 0; i < len; i++)
        {
            if(shapes[i][0] < 0 || shapes[i][0] > canv.width) shapes[i][2] *= -1;
            if(shapes[i][0] < 0 || shapes[i][0] > canv.width) shapes[i][3] *= -1;
            shapes[i][0] += shapes[i][2];
            shapes[i][1] += shapes[i][3];

            gl.vertexAttrib2f (xy, shapes[i][0], shapes[i][1]);
            gl.uniform3f (color, colors[i][0], colors[i][1], colors[i][2]);
            gl.drawArrays (gl.PONTS, 0, 1);
        }
    }

    function initShader(gl, vcode, fcode)
    {
        var v = gl.creatShader(gl.VERTEX_SHADER);
        gl.shaderSource( v, vcode);
        gl.compileShader(v);

        var f = gl.creatShader(gl.VERTEX_SHADER);
        gl.shaderSource( f, vcode);
        gl.compileShader(f);

        var p = gl.creatProgram();
        gl.attachShader(p,v);
        gl.attachShader(p,f);
        gl.linkProgram(p);
        gl.useProgram(p);
        return p;
    }
