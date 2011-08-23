﻿// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████              ██                ██   
//  ██                  ██                ██   
//  ██     █████ █████ █████ █████ ██ ██ █████ 
//  ██     ██ ██ ██ ██  ██   ██ ██ ██ ██  ██   
//  ██     ██ ██ ██ ██  ██   █████  ███   ██   
//  ██     ██ ██ ██ ██  ██   ██    ██ ██  ██   
//  ██████ █████ ██ ██  ████ █████ ██ ██  ████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Context - Provides a convenient access to the major DOM elements

	// --------------------------------------------------------------------------------
	// Constructor
	
		/**
		 * Context object supplies the "this" context for all iterative operations' callbacks
		 * 
		 * @param	dom			{Context}			A Context object with a valid dom property
		 * @param	dom			{Boolean}			Pass true to grab the current Document DOM
 		 * @param	dom			{Number}			The 0-based index of the Document
		 * @param	dom			{String}			The name of the Document
		 * @param	dom			{File}				A valid .fla file
		 * @param	dom			{Document}			A Document
		 * 
		 * @param	timeline	{Context}			A Context object with a valid timeline property
		 * @param	timeline	{Boolean}			Pass true to grab the current timeline
		 * @param	timeline	{String}			The name of (path to) an item in the library
		 * @param	timeline	{Number}			The 0-based index of an item in the library
		 * @param	timeline	{SymbolInstance}	A Symbol Instance
		 * @param	timeline	{SymbolItem}		A SymbolItem
		 * @param	timeline	{Timeline}			A Symbol Item's timeline reference
		 * 
		 * @param	layer		{Context}			A Context object with a valid layer property
		 * @param	layer		{Boolean}			Pass true to grab the current layer
		 * @param	layer		{String}			The name of the layer
		 * @param	layer		{Number}			The 0-based index of the layer
		 * @param	layer		{Layer}				A Layer
		 * 
		 * @param	frame		{Context}			A Context object with a valid frame property
		 * @param	frame		{Boolean}			Pass true to grab the current frame
		 * @param	frame		{String}			The name of the frame
		 * @param	frame		{Number}			The 0-based index of the frame
		 * @param	frame		{RegExp}			The keyframe index of the frame, i.e. /2/
		 * @param	frame		{Frame}				A Frame
		 * 
		 * @param	element		{Context}			A Context object with a valid element property
		 * @param	element		{String}			The name of the element
		 * @param	element		{Number}			The 0-based index of the element
		 * @param	element		{Element}			An element
		 */
		Context = function(dom, timeline, layer, frame, element)
		{
			if(dom)
				this.setDOM(dom);
			if(timeline)
				this.setTimeline(timeline);
			if(layer)
				this.setLayer(layer);
			if(frame)
				this.setFrame(frame);
			if(element)
				this.setElement(element);
			return this;
		}
		
	// --------------------------------------------------------------------------------
	// Static methods
	
		//TODO consider modifying Context.create() to just take a single argument
		// That way you pass in any object, and the context is worked out automatically
	
		/**
		 * Factory method provides the quickest way to get the current context
		 * @param	dom			{Boolean}	An optional flag to not create a dom context
		 * @param	timeline	{Boolean}	An optional flag to not create a timeline context
		 * @param	layer		{Boolean}	An optional flag to not create a layer context
		 * @param	frame		{Boolean}	An optional flag to not create a frame context
		 * @returns				{Context}	A new Context instance
		 */
		Context.create = function(dom, timeline, layer, frame, element)
		{
			// create a new context
				var context = new Context
				(
					dom === false ? false : true,
					timeline === false ? false : true,
					layer === false ? false : true,
					frame === false ? false : true,
					element === false ? false : true
				);
				
			// update the stage & return
				if(context.dom)
				{
					context.dom.livePreview = true;
				}
				return context;
		}
		
		/**
		 * Creates a context from a supplied element
		 * @param	value	
		 * @returns		
		 */
		Context.from = function(value)
		{
			switch(xjsfl.utils.getClass(value))
			{
				
			}
		}
	
	// --------------------------------------------------------------------------------
	// Prototype
	
		Context.prototype =
		{
			// --------------------------------------------------------------------------------
			// public Context properties
			
				/**
				 * @type {Document}	A Document Object
				 */
				dom:null,
			
				/**
				 * @type {Item}		A Library Item
				 */
				item:null,
			
				/**
				 * @type {Timeline}	A Timeline
				 */
				timeline:null,
			
				/**
				 * @type {Layer}	A Layer
				 */
				layer:null,
			
				/**
				 * The layer's keyframes
				 * Using a getter here, not setting them when the layer context changes, in case keyframes are added or deleted in between
				 * @type {Array}
				 */
				get keyframes()
				{
					if(this.layer)
					{
						var index		= 0;
						var keyIndex	= 0;
						var keyframes	= [];
						while(index < this.layer.frameCount)
						{
							if(this.layer.frames[index].startFrame === index)
							{
								keyframes[keyIndex++] = this.layer.frames[index];
							}
							index++;
						}
						return keyframes;
					}
					return [];
				},
				
				/**
				 * @type {Frame}	A Frame
				 */
				frame:null,
					
				/**
				 * @type {Element}	An element
				 */
				element:null,
					
			// --------------------------------------------------------------------------------
			// getters
			
				/**
				 * @type {String}
				 */
				context:'',
				
				/**
				 * The current layer index
				 * @type {Number}
				 */
				get layerIndex()
				{
					if(this.timeline)
					{
						var name			= this.layer.name;
						this.layer.name		= '__Context__';
						var index			= this.timeline.findLayerIndex(this.layer.name)[0];
						this.layer.name		= name;
						return index;
					}
					else
					{
						return -1;
					}
				},
			
			// --------------------------------------------------------------------------------
			// setters
			
				/**
				 * Set the DOM of the Context object
				 * @param	value	{Context}	A Context object with a valid dom property
				 * @param	value	{Boolean}	Pass true to grab the current Document DOM
				 * @param	value	{Number}	The 0-based index of an open Document
				 * @param	value	{String}	The name of an open Document, or the path or URI to an existing .fla file
				 * @param	value	{File}		An existing .fla file
				 * @param	value	{Document}	A Document
				 * @returns			{Context}	Itself
				 */
				setDOM:function(value)
				{
					// variables
						var dom;
						
					// true
						if(value === true || value === undefined)
						{
							dom = fl.getDocumentDOM();
						}
					// Document
						else if(value instanceof Document)
						{
							dom = value;
						}
					// Document index
						else if(typeof value === 'number')
						{
							dom = fl.documents[value];
						}
					// Document name
						if(typeof value === 'string')
						{
							if(/\.fla$/.test(value))
							{
								return(this.setDOM(new File(value)));
							}
							else
							{
								dom = fl.documents.filter(function(e){ return e.name == value; })[0];
							}
						}
					// File
						else if(value instanceof File)
						{
							if(value.exists)
							{
								dom = fl.documents.filter(function(doc){ return doc.pathURI == value.uri; })[0]
								if(dom == undefined)
								{
									dom = fl.openDocument(value.uri);
								}
							}
						}
					// Context
						else if(value instanceof Context)
						{
							dom = value.dom;
						}
					// context
						if(dom)
						{
							// nullify related elements if timeline changes
								if(this.dom != dom)
								{
									this.item		= null;
									this.timeline	= null;
									this.layer		= null;
									this.frame		= null;
								}
							// properties
								this.context	= 'dom';
								this.dom		= dom;
						}
					// return
						return this;
				},
				

				/**
				 * Set the Timeline of the Context object
				 * @param	value	{Context}			A Context object with a valid timeline property
				 * @param	value	{Boolean}			Pass true to grab the current timeline
				 * @param	value	{String}			The name of (path to) an item in the library
				 * @param	value	{Number}			The 0-based Scene index
				 * @param	value	{SymbolItem}		A SymbolItem
				 * @param	value	{SymbolInstance}	A Symbol Instance
				 * @param	value	{Timeline}			A Symbol's timeline reference
				 * @param	value	{null}				The document root
				 * @returns			{Context}			Itself
				 */
				setTimeline:function(value)
				{
					// exit early if no dom for some data types
						var state = value instanceof Timeline || value === true || value === undefined || typeof value === 'string' || typeof value === 'number' || value === null;
						if(state && ! this.dom )
						{
							this.setDOM(true);
							//throw new ReferenceError('ReferenceError: Cannot set Timeline as Context has no DOM');
							//return this;
						}
						
					// variables
						var timeline, item;
					
					// Timeline or true
						if(value instanceof Timeline || value === true || value === undefined)
						{
							timeline = value === true ? this.dom.getTimeline() : value;
							for each(var _item in this.dom.library.items)
							{
								if(_item instanceof SymbolItem && _item.timeline === timeline)
								{
									item = _item;
									break;
								}
							}
						}
					// Library item
						else if(value instanceof SymbolItem)
						{
							item		= value;
							timeline	= item.timeline;
						}
					// Stage instace
						else if(value instanceof SymbolInstance)
						{
							item		= value.libraryItem;
							timeline	= item.timeline;
						}
					// Context
						else if(value instanceof Context)
						{
							item		= value.item;
							timeline	= value.timeline;
						}
					// Library item path
						else if(typeof value == 'string')
						{
							var index = parseInt(this.dom.library.findItemIndex(value));
							if( ! isNaN(index))
							{
								item		= this.dom.library.items[index];
								timeline	= this.item.timeline;
							}
						}
					// Scene index (set null or 0 for document root)
						else if(typeof value === 'number' || value === null)
						{
							value = Number(value);
							item = value >= 0 && value < this.dom.timelines.length ? value : undefined;
							if(item != undefined)
							{
								timeline	= this.dom.timelines[value];
							}
						}
						
					// context
						if(timeline)
						{
							// nullify related elements if timeline changes
								if(this.timeline != timeline)
								{
									this.layer		= null;
									this.frame		= null;
								}
								
							// properties
								this.item		= item;
								this.timeline	= timeline;
								this.context	= 'timeline';
						}
					// return
						return this;
				},
				
				/**
				 * Set the Layer of the Context object
				 * @param	value	{Context}	A Context object with a valid layer property
				 * @param	value	{Boolean}	Pass true to grab the current layer
				 * @param	value	{String}	The name of the layer
				 * @param	value	{Number}	The 0-based index of the layer
				 * @param	value	{Layer}		A Layer
				 * @returns			{Context}	Itself
				 */
				setLayer:function(value)
				{
					// exit early if no timeline
						var state = value === true || value === undefined || typeof value === 'string' || typeof value === 'number' || value === null;
						if(state && ! this.timeline )
						{
							this.setTimeline(true);
							//throw new ReferenceError('ReferenceError: Cannot set Layer as Context has no Timeline');
							//return this;
						}
						
					// variables
						var layer;
						
					// true
						if(value === true || value === undefined)
						{
							layer = this.timeline.layers[this.timeline.currentLayer];
							//this.layerIndex = this.timeline.currentLayer;
						}
					// Layer index or Layer name
						if(typeof value === 'string' || typeof value === 'number')
						{
							// variables
								var _layer;
								var index	= typeof value === 'string' ? this.timeline.findLayerIndex(value): value;
								if(index !== undefined)
								{
									_layer	= this.timeline.layers[index];
								}
								
							// grab layer
								if(_layer)
								{
									layer		= _layer;
									//this.layerIndex	= index;
								}
								else
								{
									throw new ReferenceError('ReferenceError: "' +value+ '" is not a valid layer in Context.setLayer()');
								}
						}
					// Layer
						else if(value instanceof Layer)
						{
							layer		= value;
							//this.layerIndex	= Number(this.timeline.findLayerIndex(value)) || -1;
						}
					// Context
						else if(value instanceof Context)
						{
							layer		= value.layer;
							//this.layerIndex = value.layerIndex;
						}
						
					// context
						if(layer)
						{
							// nullify related elements if timeline changes
								if(this.layer != layer)
								{
									this.frame	= null;
								}
								
							// properties
								this.layer		= layer;
								this.context	= 'layer';
						}
						
					// return
						return this;
				},
				
				/**
				 * Set the Frame of the Context object
				 * @param	value		{Context}	A Context object with a valid frame property
				 * @param	value		{Boolean}	Pass true to grab the current frame
				 * @param	value		{String}	The name of the frame
				 * @param	value		{Number}	The 0-based index of the frame
				 * @param	value		{RegExp}	A numeric RegExp indicating the keyframe index, i.e. /2/
				 * @param	value		{Frame}		A Frame
				 * @param	allLayers	{Boolean}	Optionally search all layers, when specifying a named frame
				 * @returns				{Context}	Itself
				 */
				setFrame:function(value)
				{
					// exit early if no layer
						if( ! this.layer )
						{
							throw new ReferenceError('ReferenceError: Cannot set Frame as Context has no Layer');
							return this;
						}
						
					// variables
						var frame;
						
					// Frame index
						if(typeof value === 'number')
						{
							if(value >= 0 && value < this.layer.frameCount)
							{
								frame = this.layer.frames[value];
							}
						}
					// true
						else if(value === true || value === undefined)
						{
							frame = this.layer.frames[this.timeline.currentFrame];
						}
					// Frame
						else if(value instanceof Frame)
						{
							frame = value;
						}
					// Keyframe index (RegExp, i.e. /2/)
						else if(value instanceof RegExp)
						{
							var keyframeIndex = parseInt(value.toSource().substr(1));
							frame = this.keyframes[keyframeIndex];
						}
					// Context
						else if(value instanceof Context)
						{
							frame = value.frame;
						}
					// Frame name - search all layers and frames
						else if(typeof value === 'string')
						{
							var _layer, _frame;
							for(var i = 0; i < this.timeline.layers.length; i++)
							{
								_layer = this.timeline.layers[i];
								for(var j = 0; j < _layer.frames.length; j++)
								{
									_frame = _layer.frames[j];
									if(_frame.name === value)
									{
										this.layer	= _layer;
										frame		= _frame;
										break;
									}
								}
								if(frame)
								{
									break;
								}
							}
						}
						
					// context
						if(frame)
						{
							this.frame		= frame;
							this.context	= 'frame';
						}
					// return
						return this;
				},
				
				/**
				 * Set the Keyframe of the Context object
				 * @param	keyframeIndex	{Number}		The 0-based index of the keyframe you want to target (i.e. passing 1 would select the 2nd keyframe, which might be on frame 12)
				 * @param	layer			{Context}		A Context object with a valid layer property
				 * @param	layer			{Boolean}		Pass true to grab the current layer
				 * @param	layer			{String}		The name of the layer
				 * @param	layer			{Number}		The 0-based index of the layer
				 * @param	layer			{Layer}			A Layer
				 * @returns					{Context}		Itself
				 */
				setKeyframe:function(keyframeIndex, layer)
				{
					// update the layer, if supplied
						if(layer)
						{
							this.setLayer(layer);
						}
						
					// exit early if no timeline
						if( ! this.timeline )
						{
							throw new ReferenceError('ReferenceError: Cannot set Keyframe as Context has no Timeline');
							return this;
						}
						
					// find the keyframe
						var keyframe = this.keyframes[keyframeIndex];
						if(keyframe)
						{
							this.setFrame(keyframe);
						}

					// return
						return this;
				},
				
				/**
				 * Set the Element of the Context object
				 * @param	value	{Context}		A Context object with a valid element property
				 * @param	value	{Boolean}		Pass true to grab the first element
				 * @param	value	{String}		The name of the element
				 * @param	value	{Number}		The 0-based index of the element
				 * @param	value	{Element}		An element
				 * @returns			{Context}		Itself
				 */
				setElement:function(value)
				{
					// exit early if no frame
						if( ! this.frame )
						{
							trace(this)
							throw new ReferenceError('ReferenceError: Cannot set Element as Context has no Frame');
							return this;
						}
						
					// Element
						if(value instanceof Element)
						{
							if(this.frame.elements.indexOf(value) != -1)
							{
								this.element = value;
							}
						}
						
					// Boolean
						else if(value === true)
						{
							this.element = this.frame.elements[0];
						}
						
					// Element index
						else if(typeof value === 'number')
						{
							this.element = this.frame.elements[value];
						}
						
					// Element name
						if(typeof value === 'string')
						{
							var i = 0;
							this.element = null;
							while(i < this.frame.elements.length)
							{
								if(this.frame.elements[i]['name'] == value)
								{
									this.element = this.frame.elements[i];
									break;
								}
							}
						}
						
					// context
						if(this.element)
						{
							this.context = 'element';
						}
					// return
						return this;
				},
				/*
				*/
			
			// --------------------------------------------------------------------------------
			// other methods
			
				/**
				 * Updates the timeline playhead to the correct frame
				 * @returns					{Context}	Itself
				 */
				goto:function()
				{
					// current context
						var dom			= fl.getDocumentDOM();
						var timeline	= dom.getTimeline();
					
					// debug
						//trace('');
					
					// document
						if(dom != this.dom)
						{
							//trace('Changing DOM: ' + this.dom.name)
							fl.setActiveWindow(this.dom);
						}
					
					// check timeline
						if(this.timeline != undefined)
						{
							// change timelines
								if(timeline != this.timeline)
								{
									if(typeof this.item === 'number')
									{
										//trace('Changing Scene: ' + this.timeline.name)
										this.dom.editScene(this.item);
									}
									else
									{
										//trace('Changing Item: ' + this.item.name)
										this.item ? this.dom.library.editItem(this.item.name) : this.dom.editScene(0);
									}
								}
							
							// layer and frame
								if(this.layer)
								{
									// go
										this.timeline.currentLayer = this.layerIndex;
									
									// frame
										if(this.frame)
										{
											//trace('Changing Frame: ' + this.frame.startFrame)
											this.timeline.currentFrame = this.frame.startFrame;
										}
								}
						}
						
					// return
						return this;
						
				},
				
			
				/**
				 * Updates all parameters of the Context Object with the current IDE state
				 * @param	dom			{Boolean}	An optional flag to not update the dom context
				 * @param	timeline	{Boolean}	An optional flag to not update the timeline context
				 * @param	layer		{Boolean}	An optional flag to not update the layer context
				 * @param	frame		{Boolean}	An optional flag to not update the frame context
				 * @returns				{Context}	Itself
				 */
				update:function(dom, timeline, layer, frame)
				{
					if(dom !== false)
						this.setDOM(true);
					if(timeline !== false)
						this.setTimeline(true);
					if(layer !== false)
						this.setLayer(true);
					if(frame !== false)
						this.setFrame(true);
					//if(element !== false)
					//	this.setElement(true);
					//Context.apply(this, [true, true, true, true, 0]);
				},
				
								
			
			// --------------------------------------------------------------------------------
			// selection methods
			
				/**
				 * Select the current context of the Context object
				 * @returns		{Context}		Itself
				 */
				select:function()
				{
					this.goto();
					
					switch(this.context)
					{
						case 'layer':		this.selectLayer.apply(this, arguments);	break;
						case 'frame':		this.selectFrame.apply(this, arguments);	break;
						case 'keyframe':	this.selectFrame.apply(this, arguments);	break;
						case 'element':		this.selectElement.apply(this, arguments);	break;
					}
					
					return this;
				},
				
				/**
				 * Select the current Layer of the Context object
				 * @param	addToSelection	{Boolean}	An optional Boolean to add to, rather than replace the current layer selection
				 * @returns					{Context}	Itself
				 */
				selectLayer:function(addToSelection)
				{
					//BUG Flash's select layers appears to toggle, not add to already selected layers
					//TODO Work out a decent workaround for already selected layers
					
					/*
					 * The following code is a WIP!
					 */
					
					if(this.timeline && this.layer)
					{
						// set the current frame
							var currentFrame	= this.timeline.currentFrame;
							
						// if null is passed in as the only argument, deselect everything
							if(addToSelection === null)
							{
								// variables	
									var currentLayer		= this.timeline.currentLayer;
									
								// deselect - HACK: bReplace is actually a toggle, so we need to check the toggled state
									this.timeline.currentLayer = 0;
									this.timeline.setSelectedFrames(0, 0);
									if(this.timeline.getSelectedFrames().length > 0)
									{
										this.timeline.setSelectedFrames(0, 0, false);
									}
									
								// reset current layer and frame
									this.timeline.currentLayer	= currentLayer;
							}
						// otherwise, select layers - need to select layers using frames, or else layer-togglng might occur
							else
							{
								// variables
									var layerIndex = this.layerIndex;
									
								// do the selection if the later index is valid
									if(layerIndex != -1)
									{
										if(addToSelection)
										{
											// if adding, don't toggle currently selected layers!
												var selectedLayers	= this.timeline.getSelectedLayers();
												
												
												trace('selectedLayers 2:' + selectedLayers)
												if(selectedLayers.indexOf(layerIndex) == -1)
												{
													trace('Selecting > ' + layerIndex)
													this.timeline.setSelectedLayers(layerIndex, false);
												}
												else
												{
													trace('NOT Selecting > ' + layerIndex)
													var selectedFrames	= this.timeline.getSelectedFrames();
													if(selectedFrames[0] == 0 && selectedFrames[1] == 0)
													{
														trace('OK, SELECTING!')
														this.timeline.setSelectedLayers(layerIndex, true);
													}
													trace('Sel frames > ' + this.timeline.getSelectedFrames())
												}
										}
										else
										{
											this.timeline.setSelectedLayers(layerIndex, true);
										}
										/*
										*/
										//trace(this.layerIndex, 0, this.layer.frameCount)
										//this.timeline.currentLayer = this.layerIndex;
										//this.timeline.setSelectedFrames(0, this.layer.frameCount, ! addToSelection);
									}
							}
						// reset the current frame
							this.timeline.currentFrame	= currentFrame;
					}
					return this;
				},
				
				/**
				 * Select the current Frame of the Context object
				 * @param	addToSelection	{Boolean}	An optional Boolean to add to, rather than replace the current frame selection
				 * @returns					{Context}	Itself
				 */
				selectFrame:function(addToSelection)
				{
					if(this.timeline && this.layer && this.frame)
					{
						// if null is passed in as the only argument, deselect everything
							if(addToSelection === null)
							{
								this.timeline.setSelectedFrames(0,0);
							}
						// otherwise, select frames
							else
							{
								var layerIndex	= Number(this.timeline.findLayerIndex(this.layer.name) || -1);
								if(layerIndex != -1)
								{
									this.timeline.currentLayer = layerIndex;
									this.timeline.setSelectedFrames(this.frame.startFrame, this.frame.startFrame + this.frame.duration, ! addToSelection);
									this.timeline.currentFrame = this.frame.startFrame;
								}
							}
					}
					return this;
				},
				
				/**
				 * Selects the current element, if there is one
				 * @param	addToSelection	{Boolean}	An optional Boolean to add to, rather than replace the current element selection
				 * @returns					{Context}	Itself
				 */
				selectElement:function(addToSelection)
				{
					if(this.element)
					{
						if( ! addToSelection)
						{
							this.dom.selectNone();
						}
						this.dom.selection = [this.element];
					}
					return this;
				},
				
			// --------------------------------------------------------------------------------
			// utilities
			
				/**
				 * Returns a copy of the Context object
				 * @returns	{Context}	A new Context instance
				 */
				clone:function()
				{
					return new Context(this.dom, this.timeline, this.layer, this.frame);
				},
				
				/**
				 * Return a String representation of the Context object
				 * @returns		{String}	The String representation of the Conext object
				 */
				toString:function()
				{
					var str = '[object Context';
					if(this.dom)
						str += ' dom="' +this.dom.name+ '"';
					if(this.timeline)
						str += ' timeline="' + (this.timeline.name) + '"';
					if(this.layer)
						str += ' layer[' +this.layerIndex+ ']="' +this.layer.name+ '"';
					if(this.frame)
					{
						var index	= this.keyframes.indexOf(this.frame);
						str += ' keyframe[' +index+ ']=' +this.frame.startFrame;
					}
					if(this.element)
					{
						var name = '';
						if(this.element.name)
						{
							name = '"' +this.element.name+ '"';
						}
						else
						{
							if(this.element.elementType == 'instance')
							{
								name = '<unnamed ' +this.element.elementType+ '>';
							}
							else
							{
								name = '<' +this.element.elementType+ '>';
							}
						}
						str += ' element="' +name+ '"';
					}
					/*
					*/
					return str + ']'
				}
		}
		
	// --------------------------------------------------------------------------------
	// Register class
	
		xjsfl.classes.register('Context', Context);
	
	
// -----------------------------------------------------------------------------------------------------------------------------------------
// Test code
	
	if( ! xjsfl.loading )
	{
		// initialize
			xjsfl.init(this);
			//clear();
			try
			{

		// --------------------------------------------------------------------------------
		// Create a default Context [contextCreate]
		
			if(0)
			{
				var context = Context.create();
				trace(context);
			}
		
		// --------------------------------------------------------------------------------
		// Create a context, then change one element [contextUpdate]
		
			if(0)
			{
				var context = Context
								.create()
								.setLayer(2);
				trace(context);
			}
		
		// --------------------------------------------------------------------------------
		// Create a context, then clone it change one element [contextCloneUpdate]
		
			if(0)
			{
				var context = Context
								.create()
								.clone()
								.setKeyframe(2, 'Layer 5')
								.selectFrame();
				trace(context);
			}
		
		// --------------------------------------------------------------------------------
		// Change contexts [contextChangeContexts]
		
			if(0)
			{
				
				// --------------------------------------------------------------------------------
				// contexts
				
					// file
						var file		= new File('file:///E|/05%20-%20Commercial%20Projects/xJSFL/3%20-%20development/dev/JSFL/assets/fla/frames%20and%20shapes.fla');
					
					// create Contexts
						var contexts =
						[
							new Context(0, 'folder/static text', 'Layer 2', 2),
							new Context(0, 'folder/static text', 'Layer 3', /2/),
							new Context(0, 'folder/dynamic text', 0, 4),
							new Context(file, 0, 'Layer 4', /1/),
							new Context(file, 1, 0, 0),
							new Context(file, 'oval', 0, 0)
						];
						
					// debug
						Output.list(contexts);
					
				// --------------------------------------------------------------------------------
				// callback function to switch contexts
				
					/**
					 * @param	event	{XULEvent}
					 */
					function updateContext(event)
					{
						var index	= parseInt(event.control.id.substr(6,1));
						var context	= contexts[index];
						trace(context);
						context.goto();
					}
					
				// --------------------------------------------------------------------------------
				// UI
				
					// setup
						var xul	= XUL.factory();
						var i	= 0;
						
					// add buttons
						for each(var context in contexts)
						{
							var id		= 'button' + (i++);
							var label	= context.toString().substr(21).replace(/\s*\]$/, '').replace(/\s*\S*=|"/g, '~').replace(/~+$/, '').replace(/~+/g, ' > ');
							xul
								.addButton(label, id)
								.addEvent(id, 'command', updateContext);
						}
						
					// finish
						xul
							.addButton('Clear', 'clear', null, {command:fl.outputPanel.clear})
							.show();
			}
		
		// --------------------------------------------------------------------------------
		// Performance test [contextBenchmark]
		
			if(0)
			{
				// Context create
					Timer.start('10000 iterations of Context.create()');
					var context;
					for(var i = 0; i < 10000; i++)
					{
						context = Context.create();
					}
					Timer.stop();
					trace(context + '\n');
				
				// Context update
					Timer.start('10000 iterations of Context.update()');
					var context = Context.create();
					for(var i = 0; i < 10000; i++)
					{
						context.update();
					}
					Timer.stop();
					trace(context + '\n');
				
				// Context clone
					Timer.start('10000 iterations of Context.clone()');
					var clone, context = Context.create();
					for(var i = 0; i < 10000; i++)
					{
						clone = context.clone();
					}
					Timer.stop();
					trace(clone + '\n');
			}
		
		// --------------------------------------------------------------------------------
		// Select a layer [contextSelectLayer]
		
			if(0)
			{
				var context = new Context(true,true,true,true);
				context
					.selectLayer();
				trace(context);
			}
		
		// --------------------------------------------------------------------------------
		// Select an element [contextSelectElement]
		
			if(0)
			{
				var context = Context.create();
				context
					.select(true); // element is the last context in Context, after Context.create() has run
				trace(context);
			}
		
		// --------------------------------------------------------------------------------
		// Select a keyframe [contextSelectKeyframe]
		
			if(0)
			{
				var context = Context.create();
				context
					.setLayer(2)
					.setKeyframe(1)
					.select();
				trace(context);
			}
		
		// --------------------------------------------------------------------------------
		// Process a layer's keyframes [contextProcessKeyframes]
		
			if(0)
			{
				//TODO check that frame selection isn't suffering the same toggle bug that layers are
				var context		= Context.create();
				var keyframes	= context.keyframes;
				for(var k in keyframes)
				{
					context.setFrame(keyframes[k]).select();
					context.frame.name = 'Frame ' + k;
					alert('Keyframe ' +k+ ' selected: ' + context);
				}
			}
		
		// --------------------------------------------------------------------------------
		// Select multiple layers [contextSelectLayers]
		
			if(0)
			{
				var timeline = dom.getTimeline();
				for each(var index in [0,1,2,3,4,5,6])
				{
					timeline.setSelectedLayers(index, false)
				}
			}
		
		// --------------------------------------------------------------------------------
		// Select multiple layers - BUG TESTING!
		
			if(0)
			{
				var context = Context.create();
				context.selectLayer(null);
				//for each(var index in [1,3,5])
				//for each(var index in [0])
				for each(var index in [0,0,2,4,6]) // selecting the same layer twice seems to deselect it
				{
					context.setLayer(index);
					trace(context.keyframes)
					context.selectLayer(true);
					trace(context);
				}
			}
			//dom.getTimeline().setSelectedLayers(1, 0)
		
		// --------------------------------------------------------------------------------
		// Select every other layer [contextSelectAlternateLayers]
		
			if(0)
			{
				var context = Context.create();
				for(var i = 0; i < context.timeline.layerCount; i+=2)
				{
					context.setLayer(i).select(true)
					trace(context)
				}
			}
		
		// catch
			}catch(err){xjsfl.output.debug(err);}
	}
		
