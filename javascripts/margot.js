$(document).ready(function() {
  // replace full calendar icons
  $(".fc-prev-button")
    .html('<span class="fa fa-chevron-left"></span>')
    .prependTo(".fc-toolbar.fc-header-toolbar")
    .removeClass("btn btn-default");
  $(".fc-next-button")
    .html('<span class="fa fa-chevron-right"></span>')
    .appendTo(".fc-toolbar.fc-header-toolbar")
    .removeClass("btn btn-default");

  $(".form-control").each(function() {
    var parent = $(this).closest(".form-group");
    parent.addClass(
      $(this)
        .prop("tagName")
        .toLowerCase()
    );
    parent.addClass($(this).attr("type"));
    if ($(this).hasClass('bazar-date')) parent.addClass('date');
    if ($(this).hasClass('summernote')) parent.addClass('summernote');
    if ($(this).hasClass("wiki-textarea")) {
      parent.addClass("wiki-textarea");
      parent.find(".control-label").prependTo(parent.find(".aceditor-toolbar"));
    }
  });
  $('[type=checkbox]').each(function() {
    $(this).closest(".form-group").addClass('checkbox');
  });

  $(".controls .radio, .controls .checkbox").each(function() {
    var parent = $(this).closest(".form-group");
    parent.addClass("form-control wrapper");
  });
  $('.bazar-radio').each(function() {
    $(this).closest('.wrapper').addClass('radio')
  })

  // also when page is loaded in modal
  $(document).on("yw-modal-open", function() {
    $modal = $("#YesWikiModal");
    var title = $modal.find('.BAZ_fiche_titre:first');
    if (title.length == 0){
      title = $modal.find('.modal-body h1,.modal-body h3').first();
    }
    if (title.length > 0){
      $modal.find('.modal-header h1').remove();
      $modal.find('.modal-header h3').remove();
      $modal.find('.modal-header').prepend(title);
    }
    var image = $modal.find('[data-id=bf_image]');
    $modal.find(".BAZ_cadre_fiche").prepend(image);
    $modal.find('.modal-body').prepend("<div class='separator'></div>");
    // ajout du span pour les checkbox/radio oubliés
    $("#YesWikiModal input[type='checkbox'], #YesWikiModal input[type='radio']").each(function(){updateSpanInput(this)})
    // Modification des boutons pour retourner dans l'historique
    $("#YesWikiModal input.btn[onclick*='history.back()']").each(function (){
      $(this).attr('data-dismiss','modal') ;
      $(this).removeAttr('onclick') ;
    }) ;
    $("#YesWikiModal .tooltip_aide").each(function(){addTooltip(this)});
    $("#YesWikiModal .bazar-list .panel-collapse")
    .on("hide.bs.collapse", function() {
      $(this)
        .parent()
        .addClass("collapsed");
    })
    .on("show.bs.collapse", function() {
      $(this)
        .parent()
        .removeClass("collapsed");
    });
    $("#YesWikiModal #search-form + .facette-container").each(function() {
      $(this)
        .siblings("#search-form")
        .prependTo($(this).find(".results-col"));
    });
  });

  // ajout du span pour les checkbox/radio oubliés
  $("input[type='checkbox'],input[type='radio']").each(function(){updateSpanInput(this)});
  
  function updateSpanInput(element) {
    if (
      $(element)
        .next().length == 0 ||
        $(element).next().not("span").length > 0
    ) {
      if ($(element).parents(".switch").length==0) {
		if ($(element).parent("td").length > 0){
          $(element).after("<label class=" + $(element).attr('type') + "></label>");
		  var label_elem = $(element).next() ;
		  label_elem.append(element);
		  label_elem.append("<span></span>");
	    } else {
		  $(element).after("<span></span>");
		}
      }
    }
  };
  // hack pour la ferme a wiki dont l'input hidden cachait le reste
  $("#bf_dossier-wiki")
    .parents(".control-group.email.password")
    .removeClass("hidden");

  $(".tooltip_aide").each(function(){addTooltip(this)});
  function addTooltip(element) {
    var tooltip = $(element).data("original-title") || ($(element).attr("title") || '');
    var newImage = $(
      "<span class='form-help fa fa-question-circle' title='" +
      tooltip.replace(/'/g, "&#39;") +
      "' onclick=\"$(element).tooltip(\'toggle\')\"></span>"
    );
    $(element)
      .parent()
      .append(newImage);
     newImage.tooltip();
    $(element).remove();
  };

  $(".bazar-list .panel-collapse")
    .on("hide.bs.collapse", function() {
      $(this)
        .parent()
        .addClass("collapsed");
    })
    .on("show.bs.collapse", function() {
      $(this)
        .parent()
        .removeClass("collapsed");
    });

  $("#search-form + .facette-container").each(function() {
    $(this)
      .siblings("#search-form")
      .prependTo($(this).find(".results-col"));
  });

  window.onresize = resizeNav;
  resizeNav();

  $("#yw-topnav .btn-menu").click(function() {
    $links = $("#yw-topnav .links-container");
    if ($links.is(":visible")) {
      $links.fadeOut(200);
      $("#yw-topnav .menu-backdrop").remove();
    } else {
      $links.fadeIn(200);
      $backdrop = $("<div class='menu-backdrop'></div>");
      $links.before($backdrop);
      $backdrop.click(function(e) {
        $("#yw-topnav .btn-menu").trigger("click");
        e.preventDefault();
        e.stopPropagation();
      });
    }
  });

  // Datatables
  $('.dataTables_wrapper').each(function() {
    var search = $(this).find('.dataTables_filter input[type=search]');
    search.prependTo(search.closest('.dataTables_filter'));
    search.before('<span class="input-group-addon"><i class="fa fa-search search-icon"></i></span>');
    search.parent().addClass('input-group');
    $(this).find('.dataTables_filter label').remove();
    $(this).find('> .row:first-child').addClass('dataTables_header');
    $(this).find('> .row:last-child').addClass('dataTables_footer');

    var container = $(this)
    var paginationSelect = $(this).find('.dataTables_length select')
    paginationSelect.change(function() {
      var pagination = container.find('.pagination')
      pagination.closest('.dataTables_footer')
        .toggleClass('no-pagination', pagination.find('li').length <= 3)
    }).trigger('change');
    
    // remove ugly style of dt-button :)
    $(this).find('.dt-button').removeClass('dt-button')    
  });

  // Annuaire
  $('.bazar-list[data-template="annuaire_alphabetique.tpl.html"]').each(function() {
    if ($(this).prev().is('h1, h2, h3, h4, h5')) {
      $(this).prev().addClass('annuaire-title')
      $(this).prev().prepend('<i class="fa fa-search fa-flip-horizontal"></i>')
    }
  })
});

function resizeNav() {
  // console.log("resizeNav", $("#yw-topnav").outerHeight());
  var navHeight = $("#yw-topnav").outerHeight();
  $("#yw-header").css("margin-top", navHeight + "px");
  $("<style type='text/css'>.nav-down ~ #yw-main #ACEditor .btn-toolbar { top: " + navHeight + "px } </style>").appendTo("head");
}
