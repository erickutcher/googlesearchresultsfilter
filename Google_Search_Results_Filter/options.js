/*
	Google Search Results Filter
	Copyright (C) 2017-2018 Eric Kutcher
*/

function RefreshFilters()
{
	browser.runtime.sendMessage(
	{
		"type": "GET_FILTERS"
	} )
	.then( function( response )
	{
		if ( response )
		{
			var filters = "";
			var total_filters = 0;

			if ( response.filters != undefined && response.filters.length > 0 )
			{
				if ( response.filters[ 0 ] != "" )
				{
					filters = response.filters[ 0 ];
				}
				else
				{
					--response.filters.length;
				}

				for ( var i = 1; i < response.filters.length; ++i )
				{
					if ( response.filters[ i ] != "" )
					{
						filters += "\r\n" + response.filters[ i ];
					}
					else
					{
						--response.filters.length;
					}
				}

				document.getElementById( "filters" ).value = filters;

				total_filters = response.filters.length;
			}

			var totals = document.getElementById( "totals" );

			while ( totals.hasChildNodes() )
			{
				totals.removeChild( totals.firstChild );
			}

			totals.appendChild( document.createTextNode( "Total filters: " + total_filters ) );
		}
	} );
}

function SaveFilters()
{
	var filters = document.getElementById( "filters" ).value.split( "\n" );

	for ( var i = 0; i < filters.length; ++i )
	{
		filters[ i ] = filters[ i ].trim();
	}

	browser.runtime.sendMessage(
	{
		type: "SAVE_FILTERS",
		filters: filters
	} )
	.then( RefreshFilters );
}

document.addEventListener( "DOMContentLoaded", function()
{
	document.getElementById( "save-filters" ).addEventListener( "click", SaveFilters );

	RefreshFilters();
} );
