// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████              ████ ██       
//  ██                  ██            
//  ██     █████ █████  ██   ██ █████ 
//  ██     ██ ██ ██ ██ █████ ██ ██ ██ 
//  ██     ██ ██ ██ ██  ██   ██ ██ ██ 
//  ██     ██ ██ ██ ██  ██   ██ ██ ██ 
//  ██████ █████ ██ ██  ██   ██ █████ 
//                                 ██ 
//                              █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Config

	// -----------------------------------------------------------------------------------------------------------
	// setup
		// document dom
			var dom = fl.getDocumentDOM();
			if( ! dom )
			{
				dom = fl.createDocument();
			}
			
		// config
			var configURI	= xjsfl.uri + 'core/config/xjsfl.xml';
			var configStr	= FLfile.read(configURI);
	
			if( ! configStr)
			{
				fl.trace('> xjsfl: The default xJSFL config could not be found. Rebuilding...');
				configStr = '<config><settings><enabled>1</enabled></settings></config>';
			}
			var config		= new XML(configStr);

		// enabled state
			if( ! xjsfl.settings)
			{
				xjsfl.settings = { };
			}
			xjsfl.settings.enabled = config.settings.enabled == 1;

		// show panel
			var results		= dom.xmlPanel(xjsfl.uri + 'core/ui/config.xul');
		
	// -----------------------------------------------------------------------------------------------------------
	// handle results
	
		if(results.dismiss == 'accept')
		{
			// ---------------------------------------------------------------------------------------------------
			// update installation folder
			
				var installURI = FLfile.platformPathToURI(results.installfolder);
				if(xjsfl.uri != installURI)
				{
					var iniURI = fl.configURI + 'Tools/xJSFL.ini';
					FLfile.write(iniURI, folderURI);
					alert('The xJSFL installation location has been updated. Restart Flash for changes to take effect.');
				}
				
			// ---------------------------------------------------------------------------------------------------
			// toggle enabled
			
				// update config
					results.enabled = parseInt(results.enabled);
					if(xjsfl.settings.enabled != results.enabled)
					{
						// values
							xjsfl.settings.enabled = config.settings.enabled = results.enabled;
							FLfile.write(configURI, config.toXMLString());
			
						// reload xJSFL if enabled was chosen
							if(results.enabled)
							{
								xjsfl.reload();
							}
							else
							{
								var str = 'xJSFL will be disabled the next time Flash starts';
								fl.trace('\n> xjsfl: ' + str);
								alert(str);
							}
						
					}
		}
