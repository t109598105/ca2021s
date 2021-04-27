/*
	モーションセンサー
	move: イベント（{x, y}）
	2019/11/17
*/
var MotionSensor = function()
{
	var $this = this;
	var $window = $(window);
	var $myc = $('#myc');
	

	/*
		コールバックイベント
	*/
	this.move = null;


	/*
		マウス・タッチ
	*/
	var isMouseMove = false;	// マウス・タッチ操作済み
	
	$window.bind
	(
		'mousemove touchmove touchstart',
		function(e)
		{
			isMouseMove = true;
			
			/*
				座標取得
			*/
			var x = 0;
			var y = 0;

			if (e.originalEvent.constructor.name == 'MouseEvent' || e.originalEvent.type == 'mousemove')
			{
				x = parseInt(e.originalEvent.clientX);
				y = parseInt(e.originalEvent.clientY);
			}
			else if (e.originalEvent.constructor.name == 'TouchEvent')
			{
				x = parseInt(e.originalEvent.touches[0].clientX);
				y = parseInt(e.originalEvent.touches[0].clientY);
			}

			/*
				画面サイズ取得
			*/
			var width = $window.width();
			var height = $window.height();

			/*
				画面中央基点の割合座標を取得
			*/
			var xRate = (x - (width / 2)) / (width / 2);
			var yRate = (y - (height / 2)) / (height / 2);

			/*
				デバッグ出力
			*/
			$myc.find('#myc-debug').html
			(
				e.originalEvent.constructor.name + '<br>' +
				x + ', ' + y + '<br>' +
				width + ', ' + height + '<br>' +
				xRate.toFixed(2) + ', ' + yRate.toFixed(2)
			);

			/*
				視点変更
			*/
			$this.changePointView(xRate, yRate);
		}
	);



	/*
		モーションセンサ
		alpha: Z軸
		beta: X軸
		gamma: Y軸
	*/
	var isInitializedOrientation = false;	// モーションセンサ可能
	var baseBeta = 0;	// 基準Beta
	var baseGamma = 0;	// 基準Gamma

	window.addEventListener
	(
		'deviceorientation',
		function(e)
		{
			if (!e.alpha)
			{
				return;
			}
			
			if (isMouseMove)
			{
				// マウス・タッチ操作済みのため処理しない
				return;
			}

			/*
				基点取得
			*/
			if (!isInitializedOrientation)
			{
				baseBeta = e.beta;
				baseGamma = e.gamma;

				isInitializedOrientation = true;
			}

			var nowBeta = e.beta;
			var nowGamma = e.gamma;

			/*
				基点からの差を取得
			*/
			var diffBeta = nowBeta - baseBeta;
			var diffGamma = nowGamma - baseGamma;

			/*
				画面中央基点の割合を取得（±20まで）
			*/
			var limit = 20;

			if (Math.abs(diffBeta) > limit)
			{
				diffBeta = limit * Math.sign(diffBeta);
			}

			if (Math.abs(diffGamma) > limit)
			{
				diffGamma = limit * Math.sign(diffGamma);
			}

			var rateBeta = diffBeta / limit;
			var rateGamma = diffGamma / limit;

			/*
				デバッグ出力
			*/
			$myc.find('#myc-debug').html
			(
				'Base' + '<br>' +
				'Beta: '  + baseBeta.toFixed(4) + '<br>' +
				'Gamma: ' + baseGamma.toFixed(4) + '<br>' +

				'<br>' +

				'Now' + '<br>' +
				'Beta: '  + nowBeta.toFixed(4) + '<br>' +
				'Gamma: ' + nowGamma.toFixed(4) + '<br>' +

				'<br>' +

				'Diff' + '<br>' +
				'Beta: '  + diffBeta.toFixed(4) + '<br>' +
				'Gamma: ' + diffGamma.toFixed(4) + '<br>' +

				'<br>' +

				'Rate' + '<br>' +
				'Beta: '  + rateBeta.toFixed(4) + '<br>' +
				'Gamma: ' + rateGamma.toFixed(4) + '<br>'
			);

			/*
				視点変更
			*/
			$this.changePointView(rateGamma, rateBeta);
		},
		false
	);



	/*
		視点変更
		x: Xレート（-1.0～+1.0）
		y: Yレート（-1.0～+1.0）
	*/
	this.changePointView = function(x, y)
	{
		/*
			デバッグ出力
		*/
		$myc.find('#myc-debug-second').html
		(
			'x: '  + x.toFixed(4) + '<br>' +
			'y: ' + y.toFixed(4) + '<br>'
		);
		
		/*
			コールバック
		*/
		var event =
		{
			x: x,
			y: y
		};
		
		if (typeof(this.move) == 'function')
		{
			$this.move(event);
		}
	};
};