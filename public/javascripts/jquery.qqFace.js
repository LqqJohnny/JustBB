// QQ表情插件
(function($){
	$.fn.qqFace = function(options){
		var defaults = {
			id : 'facebox',
			path : 'face/',
			assign : 'content',
			tip : 'em_'
		};
		var option = $.extend(defaults, options);
		var assign = $('#'+option.assign);
		var id = option.id;
		var path = option.path;
		var tip = option.tip;

		if(assign.length<=0){
			alert('缺少表情赋值对象。');
			return false;
		}

		$(this).click(function(e){
			var strFace, labFace;
			if($('#'+id).length<=0){
				strFace = '<div id="'+id+'" style="position:absolute;display:none;z-index:1000;" class="qqFace">' +
							  '<table border="0" cellspacing="0" cellpadding="0"><tr>';
				for(var i=1; i<=75; i++){
					labFace = path+i+".gif";
					strFace += '<td><img src="'+path+i+'.gif" onclick="$(\'#'+option.assign+'\').setCaret();$(\'#'+option.assign+'\').insertAtCaret(\'' + labFace + '\');" /></td>';
					if( i % 15 == 0 ) strFace += '</tr><tr>';
				}
				strFace += '</tr></table></div>';
				$(this).parent().append(strFace);
				var offset = $(this).position();
				var top = offset.top - $(this).outerHeight() - $("#"+id).outerHeight() - 40;
				$('#'+id).css('top',top);
				$('#'+id).css('left',offset.left);
			}

			$('#'+id).show();
			e.stopPropagation();
		});

		$(document).click(function(){
			$('#'+id).hide();
			$('#'+id).hide();
		});
	};

})(jQuery);

jQuery.extend({
unselectContents: function(){
	if(window.getSelection)
		window.getSelection().removeAllRanges();
	else if(document.selection)
		document.selection.empty();
	}
});
jQuery.fn.extend({
	selectContents: function(){
		$(this).each(function(i){
			var node = this;
			var selection, range, doc, win;
			if ((doc = node.ownerDocument) && (win = doc.defaultView) && typeof win.getSelection != 'undefined' && typeof doc.createRange != 'undefined' && (selection = window.getSelection()) && typeof selection.removeAllRanges != 'undefined'){
				range = doc.createRange();
				range.selectNode(node);
				if(i == 0){
					selection.removeAllRanges();
				}
				selection.addRange(range);
			} else if (document.body && typeof document.body.createTextRange != 'undefined' && (range = document.body.createTextRange())){
				range.moveToElementText(node);
				range.select();
			}
		});
	},

	setCaret: function(){
		if(!$.browser.msie) return;
		var initSetCaret = function(){
			var textObj = $(this).get(0);
			textObj.caretPos = document.selection.createRange().duplicate();
		};
		$(this).click(initSetCaret).select(initSetCaret).keyup(initSetCaret);
	},

	insertAtCaret: function(textFeildValue){
		var textObj = $(this).get(0);
		textFeildValue = '<img src="'+textFeildValue+'">';
		if(document.all && textObj.createTextRange && textObj.caretPos){
			var caretPos=textObj.caretPos;
			caretPos.text = caretPos.text.charAt(caretPos.text.length-1) == '' ?
			textFeildValue+'' : textFeildValue;
		} else if(textObj.setSelectionRange){
			var rangeStart=textObj.selectionStart;
			var rangeEnd=textObj.selectionEnd;
			var tempStr1=textObj.value.substring(0,rangeStart);
			var tempStr2=textObj.value.substring(rangeEnd);
			textObj.value=tempStr1+textFeildValue+tempStr2;
			textObj.focus();
			var len=textFeildValue.length;
			textObj.setSelectionRange(rangeStart+len,rangeStart+len);
			textObj.blur();
		}else{
			textObj.innerHTML+=textFeildValue;
		}
		// 定位指针
		if (window.getSelection) {//ie11 10 9 ff safari
		   textObj.focus(); //解决ff不获取焦点无法定位问题
		   var range = window.getSelection();//创建range
		   range.selectAllChildren(textObj);//range 选择obj下所有子内容
		   range.collapseToEnd();//光标移至最后
	   }
	   else if (document.selection) {//ie10 9 8 7 6 5
		   var range = document.selection.createRange();//创建选择对象
		   //var range = document.body.createTextRange();
		   range.moveToElementText(textObj);//range定位到obj
		   range.collapse(false);//光标移至最后
		   range.select();
	   }
	}
});
