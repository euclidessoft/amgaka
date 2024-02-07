
var requiredField = "Renseigner correctement les champs requis";
var loadingText = "Chargement...";
var loadingHtml = '<span>Chargement...<span class="spinner-border spinner-border-sm align-middle ms-6"></span></span>';
var les_datas = {};
var is_visited = 1;
var current_effect = 'bounce';


function dateToYMD(date,with_time=-1,year_full=1) {
    var strArray=['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = date.getDate();
    var m = strArray[date.getMonth()];
    //var y = date.getFullYear();
    var y = year_full === -1 ? date.getFullYear().toString().substr(-2) : date.getFullYear();
    var time = '';
    if(with_time === 1){
        var hr = date.getHours();
        var min = date.getMinutes();
        time = ' ' + hr + ':' + min;
    }
    return '' + m + ' ' + (d <= 9 ? '0' + d : d) + ', ' + y + time;
}
function showAlert($form, $type, $message, redirect=2) {
    removeAlert();
    var $classe = '',
        $text = '',
        $svg = '';
    if($type===1){
        $svg = '<span class="bi bi-check-circle fs-1 me-4 mb-5 mb-sm-0"></span>';
        $classe = ' bg-success';
        $text = "Succès !";
        $message += redirect===1 ? ' '+"<br>Redirection en cours, veuillez patienter" : '';
        if(redirect===1) $form.find('*').prop('disabled',true);
    }else{
        $text = "Oups !";
        $classe = ' bg-danger';
        $svg = '<span class="bi bi-exclamation-triangle fs-1 me-4 mb-5 mb-sm-0"></span>';
    }
    $form.prepend('<div class="alerterForm alert '+$classe+' alert-dismissible d-flex flex-column flex-sm-row p-5 mb-5">' +
        $svg+'<div class="d-flex flex-column text-light pe-0 pe-sm-10"><h4 class="mb-2 text-white">'+$text+'</h4><span>'+$message+'</span></div>' +
        '<button type="button" class="position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto" data-bs-dismiss="alert"><span class="la la-close text-white fs-1"></span></button>' +
        '</div>');
}
function showErrors($div,$message) {
    removeAlert();
    var $classe = ' bg-danger',
        $svg = '<span class="bi bi-exclamation-triangle fs-1 me-4 mb-5 mb-sm-0"></span>';
    $div.html('<div class="text-center col-span-12 p-4 alert '+$classe+' alert-dismissible show flex items-center mb-2 mt-2 alerterForm" role="alert">' +
        $svg+'<span>'+$message+'</span>' +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> </button>' +
        '</div>');
}
function number_format (number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
function thousand(number) {
    return number_format(number,0,'.',',');
}
function thousands(number) {
    return number_format(number,2,'.',',');
}
function parse_float(number) {
    return number===null?0:parseFloat(number);
}
function removeAlert() {
    $('.alerterForm').remove();
}
function run_waitMe(effect=current_effect,text=loadingText){
    $('body').waitMe(
        {
            effect: effect,
            text: text,
            bg: 'rgba(255,255,255,0.9)',
            color: '#000',
            maxSize: '',
            waitTime: -1,
            source: '',
            textPos: 'vertical',
            fontSize: '',
            onClose: function() {}
        })
    ;
}
function dismiss_waitMe(){
    $('body').waitMe('hide');
}
function set_form_fields($form,$value){
    if($value){
        $form.find('input').attr('disabled',$value);
        $form.find('select').attr('disabled',$value);
        $form.find('textarea').attr('disabled',$value);
    }else{
        $form.find('input').removeProp('disabled').removeAttr('disabled');
        $form.find('select').removeProp('disabled').removeAttr('disabled');
        $form.find('textarea').removeProp('disabled').removeAttr('disabled');
    }
}
function empty_form_fields($form){
    $form.find('input').val('');
    $form.find('select').val('');
    $form.find('textarea').val('');
}

function set_state_item(url,id,etat=-1,func="reload_init",div_mes="show-div") {
    $.ajax({
        type: 'post',
        url : url,
        data: {id:id,etat:etat},
        datatype: 'json',
        beforeSend: function () { run_waitMe(current_effect,loadingText); },
        complete: function () { dismiss_waitMe(); },
        success: function (json) {
            if (json.statuts === 0) {
                alertify.success(json.mes);
                if(func!=="") fnCall(func);
                showAlert($('.'+div_mes),1,json.mes);
            } else alertify.alert(json.mes);
        },
        error: function(jqXHR, textStatus, errorThrown){}
    });
}
function fnCall(fn, ...args)
{
    let func = (typeof fn =="string")?window[fn]:fn;
    if (typeof func == "function") func(...args);
    else throw new Error(`${fn} is Not a function!`);
}
function isEmpty(str)
{
    return (!str || str.length === 0 || /^\s*$/.test(str));
}

$(document).ready(function () {

    $('.dropify').dropify({
        messages: {
            default: "Glisser et déposer un fichier ici ou cliquer",
            replace: "Glisser et déposer le fichier ou cliquer pour remplacer",
            remove:  "Supprimer",
            error:   "Désolé, le fichier est trop volumineux"
        }
    });
    if($('.alertJss').text() !== '') alertify.success($('.alertJss').text());
    if($('.alertJs').text() !== '') alertify.error($('.alertJs').text());

    $(document).on('submit', '.new_form', function (e) {
        e.preventDefault();
        var $form = $(this);
        if($form.hasClass('geolocated_form')) $form.find(".geolocation_input").val(JSON.stringify(les_datas));
        var url = $form.data('url');
        var formdata = (window.FormData) ? new FormData($form[0]) : null;
        var data = (formdata !== null) ? formdata : $form.serialize();
        var $btn = $form.find('.new_btn'),
            act = $btn.html();
        $.ajax({
            type: 'post',
            url: url,
            data: data,
            contentType: false,
            processData: false,
            datatype: 'json',
            beforeSend: function () {
                $btn.html(loadingHtml).prop('disabled', true);
                if($form.hasClass('wait_me')) run_waitMe(current_effect,loadingText);
                if($form.hasClass('disabled_input')) set_form_fields($form,true);
            },
            success: function (json) {
                if (json.statuts === 0) {
                    removeAlert();
                    if($form.hasClass('form_load')){
                        //empty_form_fields($form);
                        var $div_mes = $form,
                            func = $form.data('func');
                        console.log(func);
                        if($form.hasClass('in_modal')){
                            $div_mes = $('.'+$form.data('div'));
                            $('.'+$form.data('modal')).modal('hide');
                        }
                        showAlert($div_mes,1,json.mes);
                        fnCall($form.data('func'));
                    }else{
                        if(!$btn.hasClass('no_alert')){
                            if($btn.hasClass('no_redirect')) showAlert($form,1,json.mes);
                            else showAlert($form,1,json.mes,1);
                        }
                        if($btn.hasClass('will_redirect')){
                            window.location.assign(json.url_redirect);
                        }else{
                            if($btn.hasClass('no_redirect')){
                                empty_form_fields($form);
                            }else{
                                if($btn.hasClass('new_target')) window.open(json.lien,'_blank');
                                window.location.reload();
                            }
                            showAlert($form,1,json.mes);
                        }
                    }
                    alertify.success(json.mes);
                } else {
                    alertify.error(json.mes);
                    if(!$btn.hasClass('no_alert')) showAlert($form,2,json.mes,1);
                }
            },
            complete: function () {
                $btn.html(act).prop('disabled', false);
                if($form.hasClass('wait_me')) dismiss_waitMe();
                if($form.hasClass('disabled_input')) set_form_fields($form,false);
            },
            error: function (jqXHR, textStatus, errorThrown) {}
        });
    });

});