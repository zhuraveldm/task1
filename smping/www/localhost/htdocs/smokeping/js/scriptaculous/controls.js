if("undefined"==typeof Effect)throw"controls.js requires including script.aculo.us' effects.js library";var Autocompleter={};Autocompleter.Base=Class.create({baseInitialize:function(e,t,i){e=$(e),this.element=e,this.update=$(t),this.hasFocus=!1,this.changed=!1,this.active=!1,this.index=0,this.entryCount=0,this.oldElementValue=this.element.value,this.setOptions?this.setOptions(i):this.options=i||{},this.options.paramName=this.options.paramName||this.element.name,this.options.tokens=this.options.tokens||[],this.options.frequency=this.options.frequency||.4,this.options.minChars=this.options.minChars||1,this.options.onShow=this.options.onShow||function(e,t){t.style.position&&"absolute"!=t.style.position||(t.style.position="absolute",Position.clone(e,t,{setHeight:!1,offsetTop:e.offsetHeight})),Effect.Appear(t,{duration:.15})},this.options.onHide=this.options.onHide||function(e,t){new Effect.Fade(t,{duration:.15})},"string"==typeof this.options.tokens&&(this.options.tokens=Array(this.options.tokens)),this.options.tokens.include("\n")||this.options.tokens.push("\n"),this.observer=null,this.element.setAttribute("autocomplete","off"),Element.hide(this.update),Event.observe(this.element,"blur",this.onBlur.bindAsEventListener(this)),Event.observe(this.element,"keydown",this.onKeyPress.bindAsEventListener(this))},show:function(){"none"==Element.getStyle(this.update,"display")&&this.options.onShow(this.element,this.update),!this.iefix&&Prototype.Browser.IE&&"absolute"==Element.getStyle(this.update,"position")&&(new Insertion.After(this.update,'<iframe id="'+this.update.id+'_iefix" '+'style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" '+'src="javascript:false;" frameborder="0" scrolling="no"></iframe>'),this.iefix=$(this.update.id+"_iefix")),this.iefix&&setTimeout(this.fixIEOverlapping.bind(this),50)},fixIEOverlapping:function(){Position.clone(this.update,this.iefix,{setTop:!this.update.style.height}),this.iefix.style.zIndex=1,this.update.style.zIndex=2,Element.show(this.iefix)},hide:function(){this.stopIndicator(),"none"!=Element.getStyle(this.update,"display")&&this.options.onHide(this.element,this.update),this.iefix&&Element.hide(this.iefix)},startIndicator:function(){this.options.indicator&&Element.show(this.options.indicator)},stopIndicator:function(){this.options.indicator&&Element.hide(this.options.indicator)},onKeyPress:function(e){if(this.active)switch(e.keyCode){case Event.KEY_TAB:case Event.KEY_RETURN:this.selectEntry(),Event.stop(e);case Event.KEY_ESC:return this.hide(),this.active=!1,Event.stop(e),void 0;case Event.KEY_LEFT:case Event.KEY_RIGHT:return;case Event.KEY_UP:return this.markPrevious(),this.render(),Event.stop(e),void 0;case Event.KEY_DOWN:return this.markNext(),this.render(),Event.stop(e),void 0}else if(e.keyCode==Event.KEY_TAB||e.keyCode==Event.KEY_RETURN||Prototype.Browser.WebKit>0&&0==e.keyCode)return;this.changed=!0,this.hasFocus=!0,this.observer&&clearTimeout(this.observer),this.observer=setTimeout(this.onObserverEvent.bind(this),1e3*this.options.frequency)},activate:function(){this.changed=!1,this.hasFocus=!0,this.getUpdatedChoices()},onHover:function(e){var t=Event.findElement(e,"LI");this.index!=t.autocompleteIndex&&(this.index=t.autocompleteIndex,this.render()),Event.stop(e)},onClick:function(e){var t=Event.findElement(e,"LI");this.index=t.autocompleteIndex,this.selectEntry(),this.hide()},onBlur:function(){setTimeout(this.hide.bind(this),250),this.hasFocus=!1,this.active=!1},render:function(){if(this.entryCount>0){for(var e=0;this.entryCount>e;e++)this.index==e?Element.addClassName(this.getEntry(e),"selected"):Element.removeClassName(this.getEntry(e),"selected");this.hasFocus&&(this.show(),this.active=!0)}else this.active=!1,this.hide()},markPrevious:function(){this.index>0?this.index--:this.index=this.entryCount-1,this.getEntry(this.index).scrollIntoView(!0)},markNext:function(){this.index<this.entryCount-1?this.index++:this.index=0,this.getEntry(this.index).scrollIntoView(!1)},getEntry:function(e){return this.update.firstChild.childNodes[e]},getCurrentEntry:function(){return this.getEntry(this.index)},selectEntry:function(){this.active=!1,this.updateElement(this.getCurrentEntry())},updateElement:function(e){if(this.options.updateElement)return this.options.updateElement(e),void 0;var t="";if(this.options.select){var i=$(e).select("."+this.options.select)||[];i.length>0&&(t=Element.collectTextNodes(i[0],this.options.select))}else t=Element.collectTextNodesIgnoreClass(e,"informal");var n=this.getTokenBounds();if(-1!=n[0]){var r=this.element.value.substr(0,n[0]),s=this.element.value.substr(n[0]).match(/^\s+/);s&&(r+=s[0]),this.element.value=r+t+this.element.value.substr(n[1])}else this.element.value=t;this.oldElementValue=this.element.value,this.element.focus(),this.options.afterUpdateElement&&this.options.afterUpdateElement(this.element,e)},updateChoices:function(e){if(!this.changed&&this.hasFocus){if(this.update.innerHTML=e,Element.cleanWhitespace(this.update),Element.cleanWhitespace(this.update.down()),this.update.firstChild&&this.update.down().childNodes){this.entryCount=this.update.down().childNodes.length;for(var t=0;this.entryCount>t;t++){var i=this.getEntry(t);i.autocompleteIndex=t,this.addObservers(i)}}else this.entryCount=0;this.stopIndicator(),this.index=0,1==this.entryCount&&this.options.autoSelect?(this.selectEntry(),this.hide()):this.render()}},addObservers:function(e){Event.observe(e,"mouseover",this.onHover.bindAsEventListener(this)),Event.observe(e,"click",this.onClick.bindAsEventListener(this))},onObserverEvent:function(){this.changed=!1,this.tokenBounds=null,this.getToken().length>=this.options.minChars?this.getUpdatedChoices():(this.active=!1,this.hide()),this.oldElementValue=this.element.value},getToken:function(){var e=this.getTokenBounds();return this.element.value.substring(e[0],e[1]).strip()},getTokenBounds:function(){if(null!=this.tokenBounds)return this.tokenBounds;var e=this.element.value;if(e.strip().empty())return[-1,0];for(var t,i=arguments.callee.getFirstDifferencePos(e,this.oldElementValue),n=i==this.oldElementValue.length?1:0,r=-1,s=e.length,o=0,a=this.options.tokens.length;a>o;++o)t=e.lastIndexOf(this.options.tokens[o],i+n-1),t>r&&(r=t),t=e.indexOf(this.options.tokens[o],i+n),-1!=t&&s>t&&(s=t);return this.tokenBounds=[r+1,s]}}),Autocompleter.Base.prototype.getTokenBounds.getFirstDifferencePos=function(e,t){for(var i=Math.min(e.length,t.length),n=0;i>n;++n)if(e[n]!=t[n])return n;return i},Ajax.Autocompleter=Class.create(Autocompleter.Base,{initialize:function(e,t,i,n){this.baseInitialize(e,t,n),this.options.asynchronous=!0,this.options.onComplete=this.onComplete.bind(this),this.options.defaultParams=this.options.parameters||null,this.url=i},getUpdatedChoices:function(){this.startIndicator();var e=encodeURIComponent(this.options.paramName)+"="+encodeURIComponent(this.getToken());this.options.parameters=this.options.callback?this.options.callback(this.element,e):e,this.options.defaultParams&&(this.options.parameters+="&"+this.options.defaultParams),new Ajax.Request(this.url,this.options)},onComplete:function(e){this.updateChoices(e.responseText)}}),Autocompleter.Local=Class.create(Autocompleter.Base,{initialize:function(e,t,i,n){this.baseInitialize(e,t,n),this.options.array=i},getUpdatedChoices:function(){this.updateChoices(this.options.selector(this))},setOptions:function(e){this.options=Object.extend({choices:10,partialSearch:!0,partialChars:2,ignoreCase:!0,fullSearch:!1,selector:function(e){for(var t=[],i=[],n=e.getToken(),r=0;e.options.array.length>r&&t.length<e.options.choices;r++)for(var s=e.options.array[r],o=e.options.ignoreCase?s.toLowerCase().indexOf(n.toLowerCase()):s.indexOf(n);-1!=o;){if(0==o&&s.length!=n.length){t.push("<li><strong>"+s.substr(0,n.length)+"</strong>"+s.substr(n.length)+"</li>");break}if(n.length>=e.options.partialChars&&e.options.partialSearch&&-1!=o&&(e.options.fullSearch||/\s/.test(s.substr(o-1,1)))){i.push("<li>"+s.substr(0,o)+"<strong>"+s.substr(o,n.length)+"</strong>"+s.substr(o+n.length)+"</li>");break}o=e.options.ignoreCase?s.toLowerCase().indexOf(n.toLowerCase(),o+1):s.indexOf(n,o+1)}return i.length&&(t=t.concat(i.slice(0,e.options.choices-t.length))),"<ul>"+t.join("")+"</ul>"}},e||{})}}),Field.scrollFreeActivate=function(e){setTimeout(function(){Field.activate(e)},1)},Ajax.InPlaceEditor=Class.create({initialize:function(e,t,i){this.url=t,this.element=e=$(e),this.prepareOptions(),this._controls={},arguments.callee.dealWithDeprecatedOptions(i),Object.extend(this.options,i||{}),!this.options.formId&&this.element.id&&(this.options.formId=this.element.id+"-inplaceeditor",$(this.options.formId)&&(this.options.formId="")),this.options.externalControl&&(this.options.externalControl=$(this.options.externalControl)),this.options.externalControl||(this.options.externalControlOnly=!1),this._originalBackground=this.element.getStyle("background-color")||"transparent",this.element.title=this.options.clickToEditText,this._boundCancelHandler=this.handleFormCancellation.bind(this),this._boundComplete=(this.options.onComplete||Prototype.emptyFunction).bind(this),this._boundFailureHandler=this.handleAJAXFailure.bind(this),this._boundSubmitHandler=this.handleFormSubmission.bind(this),this._boundWrapperHandler=this.wrapUp.bind(this),this.registerListeners()},checkForEscapeOrReturn:function(e){!this._editing||e.ctrlKey||e.altKey||e.shiftKey||(Event.KEY_ESC==e.keyCode?this.handleFormCancellation(e):Event.KEY_RETURN==e.keyCode&&this.handleFormSubmission(e))},createControl:function(e,t,i){var n=this.options[e+"Control"],r=this.options[e+"Text"];if("button"==n){var s=document.createElement("input");s.type="submit",s.value=r,s.className="editor_"+e+"_button","cancel"==e&&(s.onclick=this._boundCancelHandler),this._form.appendChild(s),this._controls[e]=s}else if("link"==n){var o=document.createElement("a");o.href="#",o.appendChild(document.createTextNode(r)),o.onclick="cancel"==e?this._boundCancelHandler:this._boundSubmitHandler,o.className="editor_"+e+"_link",i&&(o.className+=" "+i),this._form.appendChild(o),this._controls[e]=o}},createEditField:function(){var e,t=this.options.loadTextURL?this.options.loadingText:this.getText();if(1>=this.options.rows&&!/\r|\n/.test(this.getText())){e=document.createElement("input"),e.type="text";var i=this.options.size||this.options.cols||0;i>0&&(e.size=i)}else e=document.createElement("textarea"),e.rows=1>=this.options.rows?this.options.autoRows:this.options.rows,e.cols=this.options.cols||40;e.name=this.options.paramName,e.value=t,e.className="editor_field",this.options.submitOnBlur&&(e.onblur=this._boundSubmitHandler),this._controls.editor=e,this.options.loadTextURL&&this.loadExternalText(),this._form.appendChild(this._controls.editor)},createForm:function(){function e(e,i){var n=t.options["text"+e+"Controls"];n&&i!==!1&&t._form.appendChild(document.createTextNode(n))}var t=this;this._form=$(document.createElement("form")),this._form.id=this.options.formId,this._form.addClassName(this.options.formClassName),this._form.onsubmit=this._boundSubmitHandler,this.createEditField(),"textarea"==this._controls.editor.tagName.toLowerCase()&&this._form.appendChild(document.createElement("br")),this.options.onFormCustomization&&this.options.onFormCustomization(this,this._form),e("Before",this.options.okControl||this.options.cancelControl),this.createControl("ok",this._boundSubmitHandler),e("Between",this.options.okControl&&this.options.cancelControl),this.createControl("cancel",this._boundCancelHandler,"editor_cancel"),e("After",this.options.okControl||this.options.cancelControl)},destroy:function(){this._oldInnerHTML&&(this.element.innerHTML=this._oldInnerHTML),this.leaveEditMode(),this.unregisterListeners()},enterEditMode:function(e){this._saving||this._editing||(this._editing=!0,this.triggerCallback("onEnterEditMode"),this.options.externalControl&&this.options.externalControl.hide(),this.element.hide(),this.createForm(),this.element.parentNode.insertBefore(this._form,this.element),this.options.loadTextURL||this.postProcessEditField(),e&&Event.stop(e))},enterHover:function(){this.options.hoverClassName&&this.element.addClassName(this.options.hoverClassName),this._saving||this.triggerCallback("onEnterHover")},getText:function(){return this.element.innerHTML.unescapeHTML()},handleAJAXFailure:function(e){this.triggerCallback("onFailure",e),this._oldInnerHTML&&(this.element.innerHTML=this._oldInnerHTML,this._oldInnerHTML=null)},handleFormCancellation:function(e){this.wrapUp(),e&&Event.stop(e)},handleFormSubmission:function(e){var t=this._form,i=$F(this._controls.editor);this.prepareSubmission();var n=this.options.callback(t,i)||"";if(Object.isString(n)&&(n=n.toQueryParams()),n.editorId=this.element.id,this.options.htmlResponse){var r=Object.extend({evalScripts:!0},this.options.ajaxOptions);Object.extend(r,{parameters:n,onComplete:this._boundWrapperHandler,onFailure:this._boundFailureHandler}),new Ajax.Updater({success:this.element},this.url,r)}else{var r=Object.extend({method:"get"},this.options.ajaxOptions);Object.extend(r,{parameters:n,onComplete:this._boundWrapperHandler,onFailure:this._boundFailureHandler}),new Ajax.Request(this.url,r)}e&&Event.stop(e)},leaveEditMode:function(){this.element.removeClassName(this.options.savingClassName),this.removeForm(),this.leaveHover(),this.element.style.backgroundColor=this._originalBackground,this.element.show(),this.options.externalControl&&this.options.externalControl.show(),this._saving=!1,this._editing=!1,this._oldInnerHTML=null,this.triggerCallback("onLeaveEditMode")},leaveHover:function(){this.options.hoverClassName&&this.element.removeClassName(this.options.hoverClassName),this._saving||this.triggerCallback("onLeaveHover")},loadExternalText:function(){this._form.addClassName(this.options.loadingClassName),this._controls.editor.disabled=!0;var e=Object.extend({method:"get"},this.options.ajaxOptions);Object.extend(e,{parameters:"editorId="+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(e){this._form.removeClassName(this.options.loadingClassName);var t=e.responseText;this.options.stripLoadedTextTags&&(t=t.stripTags()),this._controls.editor.value=t,this._controls.editor.disabled=!1,this.postProcessEditField()}.bind(this),onFailure:this._boundFailureHandler}),new Ajax.Request(this.options.loadTextURL,e)},postProcessEditField:function(){var e=this.options.fieldPostCreation;e&&$(this._controls.editor)["focus"==e?"focus":"activate"]()},prepareOptions:function(){this.options=Object.clone(Ajax.InPlaceEditor.DefaultOptions),Object.extend(this.options,Ajax.InPlaceEditor.DefaultCallbacks),[this._extraDefaultOptions].flatten().compact().each(function(e){Object.extend(this.options,e)}.bind(this))},prepareSubmission:function(){this._saving=!0,this.removeForm(),this.leaveHover(),this.showSaving()},registerListeners:function(){this._listeners={};var e;$H(Ajax.InPlaceEditor.Listeners).each(function(t){e=this[t.value].bind(this),this._listeners[t.key]=e,this.options.externalControlOnly||this.element.observe(t.key,e),this.options.externalControl&&this.options.externalControl.observe(t.key,e)}.bind(this))},removeForm:function(){this._form&&(this._form.remove(),this._form=null,this._controls={})},showSaving:function(){this._oldInnerHTML=this.element.innerHTML,this.element.innerHTML=this.options.savingText,this.element.addClassName(this.options.savingClassName),this.element.style.backgroundColor=this._originalBackground,this.element.show()},triggerCallback:function(e,t){"function"==typeof this.options[e]&&this.options[e](this,t)},unregisterListeners:function(){$H(this._listeners).each(function(e){this.options.externalControlOnly||this.element.stopObserving(e.key,e.value),this.options.externalControl&&this.options.externalControl.stopObserving(e.key,e.value)}.bind(this))},wrapUp:function(e){this.leaveEditMode(),this._boundComplete(e,this.element)}}),Object.extend(Ajax.InPlaceEditor.prototype,{dispose:Ajax.InPlaceEditor.prototype.destroy}),Ajax.InPlaceCollectionEditor=Class.create(Ajax.InPlaceEditor,{initialize:function(e,t,i,n){this._extraDefaultOptions=Ajax.InPlaceCollectionEditor.DefaultOptions,e(t,i,n)},createEditField:function(){var e=document.createElement("select");e.name=this.options.paramName,e.size=1,this._controls.editor=e,this._collection=this.options.collection||[],this.options.loadCollectionURL?this.loadCollection():this.checkForExternalText(),this._form.appendChild(this._controls.editor)},loadCollection:function(){this._form.addClassName(this.options.loadingClassName),this.showLoadingText(this.options.loadingCollectionText);var options=Object.extend({method:"get"},this.options.ajaxOptions);Object.extend(options,{parameters:"editorId="+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(transport){var js=transport.responseText.strip();if(!/^\[.*\]$/.test(js))throw"Server returned an invalid collection representation.";this._collection=eval(js),this.checkForExternalText()}.bind(this),onFailure:this.onFailure}),new Ajax.Request(this.options.loadCollectionURL,options)},showLoadingText:function(e){this._controls.editor.disabled=!0;var t=this._controls.editor.firstChild;t||(t=document.createElement("option"),t.value="",this._controls.editor.appendChild(t),t.selected=!0),t.update((e||"").stripScripts().stripTags())},checkForExternalText:function(){this._text=this.getText(),this.options.loadTextURL?this.loadExternalText():this.buildOptionList()},loadExternalText:function(){this.showLoadingText(this.options.loadingText);var e=Object.extend({method:"get"},this.options.ajaxOptions);Object.extend(e,{parameters:"editorId="+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(e){this._text=e.responseText.strip(),this.buildOptionList()}.bind(this),onFailure:this.onFailure}),new Ajax.Request(this.options.loadTextURL,e)},buildOptionList:function(){this._form.removeClassName(this.options.loadingClassName),this._collection=this._collection.map(function(e){return 2===e.length?e:[e,e].flatten()});var e="value"in this.options?this.options.value:this._text,t=this._collection.any(function(t){return t[0]==e}.bind(this));this._controls.editor.update("");var i;this._collection.each(function(n,r){i=document.createElement("option"),i.value=n[0],i.selected=t?n[0]==e:0==r,i.appendChild(document.createTextNode(n[1])),this._controls.editor.appendChild(i)}.bind(this)),this._controls.editor.disabled=!1,Field.scrollFreeActivate(this._controls.editor)}}),Ajax.InPlaceEditor.prototype.initialize.dealWithDeprecatedOptions=function(e){function t(t,i){t in e||void 0===i||(e[t]=i)}e&&(t("cancelControl",e.cancelLink?"link":e.cancelButton?"button":0==(e.cancelLink==e.cancelButton)?!1:void 0),t("okControl",e.okLink?"link":e.okButton?"button":0==(e.okLink==e.okButton)?!1:void 0),t("highlightColor",e.highlightcolor),t("highlightEndColor",e.highlightendcolor))},Object.extend(Ajax.InPlaceEditor,{DefaultOptions:{ajaxOptions:{},autoRows:3,cancelControl:"link",cancelText:"cancel",clickToEditText:"Click to edit",externalControl:null,externalControlOnly:!1,fieldPostCreation:"activate",formClassName:"inplaceeditor-form",formId:null,highlightColor:"#ffff99",highlightEndColor:"#ffffff",hoverClassName:"",htmlResponse:!0,loadingClassName:"inplaceeditor-loading",loadingText:"Loading...",okControl:"button",okText:"ok",paramName:"value",rows:1,savingClassName:"inplaceeditor-saving",savingText:"Saving...",size:0,stripLoadedTextTags:!1,submitOnBlur:!1,textAfterControls:"",textBeforeControls:"",textBetweenControls:""},DefaultCallbacks:{callback:function(e){return Form.serialize(e)},onComplete:function(e,t){new Effect.Highlight(t,{startcolor:this.options.highlightColor,keepBackgroundImage:!0})},onEnterEditMode:null,onEnterHover:function(e){e.element.style.backgroundColor=e.options.highlightColor,e._effect&&e._effect.cancel()},onFailure:function(e){alert("Error communication with the server: "+e.responseText.stripTags())},onFormCustomization:null,onLeaveEditMode:null,onLeaveHover:function(e){e._effect=new Effect.Highlight(e.element,{startcolor:e.options.highlightColor,endcolor:e.options.highlightEndColor,restorecolor:e._originalBackground,keepBackgroundImage:!0})}},Listeners:{click:"enterEditMode",keydown:"checkForEscapeOrReturn",mouseover:"enterHover",mouseout:"leaveHover"}}),Ajax.InPlaceCollectionEditor.DefaultOptions={loadingCollectionText:"Loading options..."},Form.Element.DelayedObserver=Class.create({initialize:function(e,t,i){this.delay=t||.5,this.element=$(e),this.callback=i,this.timer=null,this.lastValue=$F(this.element),Event.observe(this.element,"keyup",this.delayedListener.bindAsEventListener(this))},delayedListener:function(){this.lastValue!=$F(this.element)&&(this.timer&&clearTimeout(this.timer),this.timer=setTimeout(this.onTimerEvent.bind(this),1e3*this.delay),this.lastValue=$F(this.element))},onTimerEvent:function(){this.timer=null,this.callback(this.element,$F(this.element))}});