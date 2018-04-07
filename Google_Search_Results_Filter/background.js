/*
	Google Search Results Filter
	Copyright (C) 2017-2018 Eric Kutcher
*/

function HandleMessages( request, sender, sendResponse )
{
	if ( request.type == "GET_FILTERS" )
	{
		browser.storage.local.get().then( function( options )
		{
			var filters = ( options && options.filters != undefined ? options.filters : [] );

			sendResponse( { filters: filters } );
		} );
	}
	else if ( request.type == "ADD_FILTER" )
	{
		browser.storage.local.get().then( function( options )
		{
			var filters = ( options && options.filters != undefined ? options.filters : [] );

			if ( filters.indexOf( request.filter ) == -1 )
			{
				filters.push( request.filter );

				browser.storage.local.set( { filters: filters } );
			}

			sendResponse( { filter: request.filter } );
		} );
	}
	else if ( request.type == "REMOVE_FILTER" )
	{
		browser.storage.local.get().then( function( options )
		{
			var filters = ( options && options.filters != undefined ? options.filters : [] );

			var index = filters.indexOf( request.filter );

			if ( index != -1 )
			{
				filters.splice( index, 1 );

				browser.storage.local.set( { filters: filters } );
			}

			sendResponse( { filter: request.filter } );
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
