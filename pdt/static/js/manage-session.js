//convert all time in seconds to H:mm:ss
$(document).ready(function(){
    $('#devSessionList').find('.time').each(function()
    {   timeInSeconds = $(this).text();
        $(this).text(render_time(timeInSeconds));
    }
    );
    $('#remSessionList').find('.time').each(function()
    {   timeInSeconds = $(this).text();
        $(this).text(render_time(timeInSeconds));
    }
    );
    $('#mngSessionList').find('.time').each(function()
    {   timeInSeconds = $(this).text();
        $(this).text(render_time(timeInSeconds));
    }
    );
})



$('.devSessionBtn').on('click',function(e){
    var li = $(this).parent().parent();
    li.addClass('current');
    var time = li.children('.time').text();
    var sloc = parseInt(li.children('.sloc').text());
    console.log (sloc);
    var id = li.children('.id').text();
    $('#devTime').val(time);
    $('#devSLOC').val(sloc);
    $('#devId').val(id);
    $('#submitDev').modal('show');
});
$('.mngSessionBtn').on('click',function(e){
    var li = $(this).parent().parent();
    li.addClass('current');
    var time = li.children('.time').text();
    var id = li.children('.id').text();
    $('#mngTime').val(time);
    $('#mngId').val(id);
    $('#submitMng').modal('show');
});

$('.remSessionBtn').on('click',function(e){
    var li = $(this).parent().parent();
    li.addClass('current');
    var time = li.children('.time').text();
    var defect_no = li.children('.defectno').text();
    var id = li.children('.id').text();
    $('#remTime').val(time);
    $('#defectNo').val(defect_no);
    $('#remId').val(id);
    $('#submitRem').modal('show');
});

$('.viewDefectBtn').on('click',function(){
    var li = $(this).parent().parent();
    li.addClass('current');
    var report = {
    'name':li.children('.name').text(),
    'iterationInjected':li.children ('.inject').text(),
    'iterationRemoved':li.children('.remove').text(),
    'type':li.children('.type').text(),
    'desc':li.children('.desc').text(),
    };
    console.log(report);
    //hidden id field
    var defect_id = li.children('.id').text();
    $('#defectId').val(defect_id);
    render_report(report);
    $('#editReport').modal('show');
});

function render_time(time){
     var hours = parseInt( time / 3600 ) % 24;
    var minutes = parseInt( time / 60 ) % 60;
    var seconds = time % 60;
    var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
    return result;
}
function render_report(report){

    $('#viewDefectName').val(report['name']);
    $('#viewDefectDate').val(report['date']);
    var iterationInjected = report['iterationInjected'];
    $('#viewIterationInjected').children().each(function(){
        if ($(this).text() == iterationInjected)
        {   $(this).attr('selected','selected');}
    });
     $('#viewIterationRemoved').children().each(function(){
        if ($(this).text() == report['iterationRemoved'])
        {   $(this).attr('selected','selected');}
    });

    var selectedType = report['type'];
    var option = $('#viewDefectType').children();
    option.each(function(){
     if ($(this).attr('value')==selectedType)
       { $(this).attr('selected','selected');}
    });

    $('#viewDefectDesc').text(report['desc']);
}

$('#updateDev').on('submit',function(e){
    e.preventDefault();
    $('#submitDev').modal('hide');
    $.ajax({
    url: "developer/updatesession/",
    type :"POST",
    data :{
    'type' : 'dev',
     'time': $('#devTime').val(),//time is in HH:mm:ss format
     'sloc':parseInt($('#devSLOC').val()),
     'id': parseInt($('#devId').val()),
    },
    success: function(json){
        console.log(json);
        console.log("success");
    },
    error :function(xhr,errmsg,err){
        console.log(xhr.status + ': '+xhr.responseText);
    },
    });
    //update in html
    var li =$('#devSessionList').find('.current');
    li.children('.time').text($('#devTime').val());
    li.children('.sloc').text($('#devSLOC').val());

    li.removeClass('current');


});

$('#updateRem').on('submit',function(e){
    e.preventDefault();
    $('#submitRem').modal('hide');
    $.ajax({
    url: "developer/updatesession/",
    type :"POST",
    data :{
    'type':'rem',
    'defectno':parseInt($('#defectNo').val()),
    'time':$('#remTime').val(),
    'id':parseInt($('#remId').val()),
    },
    success: function(json){
        console.log("success");
    },
    error :function(xhr,errmsg,err){
        console.log(xhr.status + ': '+xhr.responseText);
    },
    });

    var li =$('#remSessionList').find('.current');
    li.children('.time').text($('#remTime').val());
    li.children('.defectno').text($('#defectNo').val());

    li.removeClass('current');

});

$('#updateMng').on('submit',function(e){
    e.preventDefault();
    $('#submitMng').modal('hide');
    $.ajax({
    url: "developer/updatesession/",
    type :"POST",
    data :{
    'type':'mng',
     'time':$('#mngTime').val(time),
     'id':  parseInt($('#mngId').val(id)),
    },
    success: function(json){
        console.log("success");
    },
    error :function(xhr,errmsg,err){
        console.log(xhr.status + ': '+xhr.responseText);
    },
    });
    var li =$('#mngSessionList').find('.current');
    li.children('.time').text($('#remTime').val());
    li.children('.sloc').text($('#defectNo').val());

    li.removeClass('current');


});

$('#editDefectForm').on('submit',function(e){
    e.preventDefault();
    $('#editReport').modal('hide');
    var report = {
          'id':parseInt($('#defectId').val()),
          'name': $('#viewDefectName').val(),
          'iterationInjected': $('#viewIterationInjected').val(),
          'iterationRemoved': $('#viewIterationRemoved').val(),
          'type': $('#viewDefectType').val(),
          'desc': $('#viewDefectDesc').val(),
        };
    var li = $('#recentDefectList').find('.current');
    li.children('.name').text($('#viewDefectName').val());
    li.children ('.inject').text($('#viewIterationInjected').val());
    li.children('.remove').text( $('#viewIterationRemoved').val());
    li.children('.type').text($('#viewDefectType').val());
    li.children('.desc').text($('#viewDefectDesc').val());

    li.removeClass('current');
    update_defect(report);


});

function update_defect(report){
    $.ajax({
    url: "developer/updatedefect/",
    type :"POST",
    data :report,
    success: function(json){
        console.log("success");
    },
    error :function(xhr,errmsg,err){
        console.log(xhr.status + ': '+xhr.responseText);
    },
    });

};
