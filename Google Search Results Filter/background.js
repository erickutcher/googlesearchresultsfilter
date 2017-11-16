/*
	Google Search Results Filter
	Copyright (C) 2017 Eric Kutcher
*/

function HandleMessages( request, sender, sendResponse )
{
	if ( request.type == "GET_FILTERS" )
	{
		browser.storage.local.get().then( function( options )
		{
			var filters = [];

			if ( options && options.filters )
			{
				filters = options.filters;
			}

			sendResponse( { filters: filters } );
		} );
	}
	else if ( request.type == "ADD_FILTER" )
	{
		browser.storage.local.get().then( function( options )
		{
			var filters = [];

			if ( options )
			{
				filters = options.filters;
			}

			if ( filters.indexOf( request.filters ) == -1 )
			{
				filters.push( request.filters );

				browser.storage.local.set( { filters: filters } );
			}

			sendResponse( { filters: request.filters } );
		} );
	}
	else if ( request.type == "REMOVE_FILTER" )
	{
		browser.storage.local.get().then( function( options )
		{
			if ( options && options.filters )
			{
				var index = options.filters.indexOf( request.filters );

				if ( index != -1 )
				{
					options.filters.splice( index, 1 );

					browser.storage.local.set( { filters: options.filters } );
				}
			}

			sendResponse( { filters: request.filters } );
		} );
	}
	else if ( request.type == "SAVE_FILTERS" )
	{
		var filters = [];

		for ( var i = 0; i < request.filters.length; ++i )
		{
			if ( request.filters[ i ] != "" )
			{
				filters.push( request.filters[ i ] );
			}
		}

		browser.storage.local.set( { filters: filters } );

		sendResponse( { filters: filters } );
	}
	
	return true;
}

browser.runtime.onMessage.addListener( HandleMessages );
