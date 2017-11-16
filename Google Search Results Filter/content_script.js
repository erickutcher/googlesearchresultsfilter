/*
	Google Search Results Filter
	Copyright (C) 2017 Eric Kutcher
*/

const DIV_CLASS_SEARCH_RESULT = "g";
const A_CLASS_SEARCH_RESULT = "fl";
const CITE_DIV_CLASS_SEARCH_RESULT = "kv";

const DIV_ID_BOTTOM_RESULTS = "bres";

const DIV_CLASS_FILTERED_SEARCH_RESULT_HIDDEN = "gsrf_hidden";
const DIV_CLASS_FILTERED_SEARCH_RESULT_VISIBLE = "gsrf_visible";

const A_CLASS_SHOW_HIDE = "gsrf_show_hide";

const A_ID_SHOW_ALL = "gsrf_show_all";
const A_ID_HIDE_ALL = "gsrf_hide_all";

var filters = [];

function UpdateFilters( type, filter )
{
	browser.runtime.sendMessage(
	{
		type: type,
		filters: filter
	} )
	.then( function ( response )
	{
		if ( response )
		{
			var show_all = ( document.getElementById( A_ID_SHOW_ALL ).style.display == "none" && document.getElementById( A_ID_HIDE_ALL ).style.display == "block" ? true : false );

			RefreshFilters( show_all );
		}
	} );
}

function UpdateSearchResults( show_all = false )
{
	var search_results = document.querySelectorAll( "div." + DIV_CLASS_SEARCH_RESULT );

	var display_footer = false;

	for ( var i = 0; i < search_results.length; ++i )
	{
		var search_result = search_results[ i ];

		var citation = search_result.querySelector( "div." + CITE_DIV_CLASS_SEARCH_RESULT + " > cite:first-of-type" );

		if ( citation == null )
		{
			continue;
		}

		var url = search_result.querySelector( "h3 > a" );

		if ( url == null )
		{
			continue;
		}

		let domain = url.hostname;
		let filter = null;

		var domain_parts = domain.split( "." );

		if ( domain_parts.length > 1 )
		{
			var subdomain = domain_parts[ domain_parts.length - 1 ];

			for ( var j = 2; j <= domain_parts.length; ++j )
			{
				subdomain = domain_parts[ domain_parts.length - j ] + "." + subdomain;

				if ( filters.indexOf( subdomain ) != -1 )
				{
					filter = subdomain;

					break;
				}
			}
		}
		else
		{
			if ( filters.indexOf( domain_parts[ 0 ] ) != -1 )
			{
				filter = domain;
			}
		}

		var show_hide_link = search_result.querySelector( "a." + A_CLASS_SHOW_HIDE );

		var new_show_hide_link = document.createElement( "a" );
		new_show_hide_link.className = A_CLASS_SEARCH_RESULT + " " + A_CLASS_SHOW_HIDE;
		new_show_hide_link.href = "javascript:;";

		if ( filter )
		{
			display_footer = true;

			if ( show_all )
			{
				search_result.classList.remove( DIV_CLASS_FILTERED_SEARCH_RESULT_HIDDEN );
				search_result.classList.add( DIV_CLASS_FILTERED_SEARCH_RESULT_VISIBLE );
				search_result.style = "display: block;";
			}
			else
			{
				search_result.classList.remove( DIV_CLASS_FILTERED_SEARCH_RESULT_VISIBLE );
				search_result.classList.add( DIV_CLASS_FILTERED_SEARCH_RESULT_HIDDEN );
				search_result.style = "display: none;";
			}

			citation.style = "color: red;";

			new_show_hide_link.title = filter;
			new_show_hide_link.addEventListener( "click", function() { UpdateFilters( "REMOVE_FILTER", filter ); }, false );
			new_show_hide_link.appendChild( document.createTextNode( "Show" ) );
		}
		else
		{
			search_result.classList.remove( DIV_CLASS_FILTERED_SEARCH_RESULT_HIDDEN );
			search_result.classList.remove( DIV_CLASS_FILTERED_SEARCH_RESULT_VISIBLE );

			citation.style = "";

			new_show_hide_link.title = domain;
			new_show_hide_link.addEventListener( "click", function() { UpdateFilters( "ADD_FILTER", domain ); }, false );
			new_show_hide_link.appendChild( document.createTextNode( "Hide" ) );
		}

		if ( show_hide_link == null )
		{
			if ( citation.parentNode.lastChild.nodeName != "DIV" )
			{
				citation.parentNode.appendChild( document.createTextNode( "\u00A0\-\u00A0" ) );
			}
			citation.parentNode.appendChild( new_show_hide_link );
		}
		else
		{
			citation.parentNode.replaceChild( new_show_hide_link, show_hide_link );
		}
	}

	document.getElementById( A_ID_SHOW_ALL ).style = ( !show_all && display_footer ? "display: block;" : "display: none;" );
	document.getElementById( A_ID_HIDE_ALL ).style = ( show_all && display_footer ? "display: block;" : "display: none;" );
}

function RefreshFilters( show_all = false )
{
	browser.runtime.sendMessage(
	{
		type: "GET_FILTERS"
	} )
	.then( function ( response )
	{
		if ( response && response.filters )
		{
			filters = response.filters;

			UpdateSearchResults( show_all );
		}
	} );
}

function Initialize()
{
	var show_all_a = document.createElement( "a" );
	show_all_a.id = A_ID_SHOW_ALL;
	show_all_a.href = "javascript:;";
	show_all_a.style = "display: none;";
	show_all_a.appendChild( document.createTextNode( "Show Filtered Results" ) );
	show_all_a.addEventListener( "click", function() { UpdateSearchResults( true ); }, false );

	var hide_all_a = document.createElement( "a" );
	hide_all_a.id = A_ID_HIDE_ALL;
	hide_all_a.href = "javascript:;";
	hide_all_a.style = "display: none;";
	hide_all_a.appendChild( document.createTextNode( "Hide Filtered Results" ) );
	hide_all_a.addEventListener( "click", function() { UpdateSearchResults(); }, false );

	var show_hide_all_div = document.createElement( "div" );
	show_hide_all_div.style = "font-style: italic;";
	show_hide_all_div.appendChild( show_all_a );
	show_hide_all_div.appendChild( hide_all_a );

	var bottom_results = document.getElementById( DIV_ID_BOTTOM_RESULTS );
	if ( bottom_results != null )
	{
		bottom_results.parentNode.insertBefore( show_hide_all_div, bottom_results.nextSibling );

		RefreshFilters();
	}
}

Initialize();
