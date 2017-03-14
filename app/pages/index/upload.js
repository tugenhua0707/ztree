
$(document).ready(function() {
  // 文件上传
   var fileupload = $('#filer_input').filer({
      showThumbs: true,
      addMore: true,
      extensions: ['xlsx'],
      allowDuplicates: false,
      captions: {
        errors: {
          filesType: "仅支持xlsx格式的文件"
        },
        feedback: "仅支持xlsx格式的文件"
      },
      afterRender: function(data){
        console.log(data)
      },
      uploadFile: {
        url: '/upload/upload',
        data: {},
        type: 'POST',
        enctype: 'multipart/form-data',
        success: function(data, el) {
          
        },
        error: function(el) {
          console.log(el)
        }
      }
   });  
   $('.u-btn').click(function(e) {
     e.preventDefault();
     console.log($('#filer_input').val());
   });  
});