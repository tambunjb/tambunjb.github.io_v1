$(() => {
    const user = 'tambunjb'

    loadData()

    function loadData() {
        const keycode = "<<<keycode>>>"
        const template = '<div><h3>'+keycode+'</h3><div class="project-desc">'+keycode+'</div><div class="row"><div>Technologies: </div><div class="project-tech">'+keycode+'</div></div><div class="row"><div>Links: </div><div>'//</div></div></div>'
        const links_template = '- <a target="_blank" href="'+keycode+'">'+keycode+'</a><br />'
        $.ajax({
            url: "https://api.github.com/users/"+user+"/repos", success: function(repos) {
                const techs = {}
                repos.forEach(repo => {
                    $.ajax({
                        url: "https://raw.githubusercontent.com/"+user+"/"+repo.name+"/main/README.md",
                        async: false,
                        success: function(readme) {
                            readme = $("<div>"+readme+"</div>")
                            const tjidtechs = readme.find("#tjidtechs").text()
                            const tjidlinks = readme.find("#tjidlinks").find("li")
                            let links = links_template.replaceAll(keycode, repo.html_url)
                            tjidlinks.each((i, link) => {
                                links += links_template.replaceAll(keycode, $(link).text())
                            })
                            $("#projects-other").append(template.replace(keycode, readme.find("#tjidtitle").text()).replace(keycode, repo.description).replace(keycode, tjidtechs)+links+'</div></div></div>')
                            tjidtechs.split(", ").forEach(tech => { 
                                if(tech) {
                                    techs[tech] = techs[tech]+1 || 1
                                }
                            })
                        }
                    })
                })
                let first = ' project(s)'
                Object.keys(techs).sort().forEach(tech => {
                    $("#buttons-filter").append('<button type="button">'+tech+' ('+techs[tech]+first+')</button>');
                    first = ''
                })
                init()
            }
        }).done(function() {
            setTimeout(function() {
                $("#overlay").fadeOut();
            });
        })
    }

    const classClicked = "clicked"
    const techFiltered = []

    function init() {
        $('#projects-filtered').children().hide()

        $("#buttons-filter").find("button").click(filterProjects);
    }

    function filterProjects() {
        const tech = $(this).text().split(' (')[0];
        if(!$(this).hasClass(classClicked)) {
            techFiltered.push(tech)
            filterTech(tech)
            $(this).addClass(classClicked)
        } else {
            techFiltered.splice(techFiltered.indexOf(tech), 1)
            unfilterTech(tech)
            $(this).removeClass(classClicked)
        }
    }

    function filterTech(tech) {
        $('#projects-other').children().each(function () {
            if($(this).is(":visible") && $(this).find(".project-tech").text().split(", ").indexOf(tech) > -1) {
                $(this).clone().appendTo("#projects-filtered")
                $(this).hide()
                $('#projects-filtered').children().show()
                $('#title-other').text('Other')
            }
        });
    }

    function unfilterTech(tech) {
        $('#projects-other').children().each(function () {
            const arr_techs = $(this).find(".project-tech").text().split(", ")
            if(arr_techs.indexOf(tech) > -1) {
                let showConfirm = true
                techFiltered.forEach(item => {
                    if(arr_techs.indexOf(item) > -1) {
                        showConfirm = false
                        return
                    }
                })
                if(showConfirm) $(this).show()
            }
        });
        $('#projects-filtered').children().each(function () {
            const arr_techs = $(this).find(".project-tech").text().split(", ")
            if(arr_techs.indexOf(tech) > -1) {
                let removeConfirm = true
                techFiltered.forEach(item => {
                    if(arr_techs.indexOf(item) > -1) {
                        removeConfirm = false
                        return
                    }
                })
                if(removeConfirm) $(this).remove()
            }
        });
        if($('#projects-filtered').children().length < 2) {
            $('#projects-filtered').children().hide()
            $('#title-other').text('All')
        }
    }

    $(document).on({
        ajaxStart: function() { $("body").addClass("loading") },
        ajaxStop: function() { $("body").removeClass("loading") }    
    })
});