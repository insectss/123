$(function(){
    //请求列表数据
    $.ajax({
        url:'getData.php',
        success:function(tmp){
            var data = JSON.parse(tmp);
            console.log(data);
            //更新数据
            var htmlStr = '';
            for(var i=0;i<data.length;i++){
                htmlStr +=' <tr data-id="'+data[i].id+'"> <td>'+data[i].id+'</td> <td>'+data[i].name+'</td> <td>'+toSex(data[i].sex)+'</td> <td>'+data[i].pro+'</td> <td>'+data[i].class+'</td><td>'+data[i].number+'</td> <td> <button class="btn btn-primary btn-xs showModal">查看 <span class="glyphicon glyphicon-eye-open"></span></button> <button class="btn btn-danger btn-xs delInfo">删除 <span class="glyphicon glyphicon-remove"></span></button> </td> </tr>';
            }
            $("#studentList tbody").html(htmlStr);
        }
    })

    //实现增加学员功能,点击提交发起数据请求
    $("#addSubmit").click(function(){
        //调用ajax发送数据给后端
        var data = $("#addForm").serialize();
        $.ajax({
            url:'http://class4/addData.php?user=谭思红 ',
            type:'POST',
            data:data,
            success:function(tmp){
                var data = JSON.parse(tmp);
                console.log(data);
                if(data.id!=undefined){
                    //  alert('添加记录成功！');
                    //  关闭模态框
                    $("#addModal").modal('hide');
                    //把追加的数据添加到网页
                    $("#studentList tbody").prepend(' <tr> <td>'+data.id+'</td> <td>'+data.name+'</td> <td>'+toSex(data.sex)+'</td> <td>'+data.pro+'</td> <td>'+data.class+'</td><td>'+data.number+'</td> <td> <button class="btn btn-primary btn-xs showModal">查看 <span class="glyphicon glyphicon-eye-open"></span></button><button class="btn btn-danger btn-xs">删除 <span class="glyphicon glyphicon-remove"></span></button> </td> </tr>');

                }
            }
        })

    })

    //查看信息
    $("body").on('click','.showModal',function(){
        //显示查询模态框
        $("#showModal").modal('show');
        var id =$(this).parents('tr').data('id');
        //调用ajax数据接口查询数据 get 请求
        var url = 'showData.php?id='+id;
        $.get(url,function(data){
            var json = JSON.parse(data);
            console.log(json);
            //将请求成功的数据，展示到模态框
            $("#showForm [name='id']").val(json.id);
            $("#showForm [name='name']").val(json.name);
            if(json.sex==0){
                $("#showForm [name='sex']").eq(1).attr('checked','checked');
            }else{
                $("#showForm [name='sex']").eq(0).attr('checked','checked');
            }
            $("#showForm [name='pro']").val(json.pro);
            $("#showForm [name='number']").val(json.number);
            $("#showForm [name='class']").val(json.class);
            $("#showForm [name='txt']").html(json.txt);
        })
    })

    //修改后保存
    $("#showSubmit").click(function(){
        //发起数据更新请求
        var data= $("#showForm").serialize();
        var url = 'updateData.php?user=admin';
        $.ajax({
            url:url,
            data:data,
            type:'POST',
            success:function(data){
                var json = JSON.parse(data);
                console.log(json);
                $('#showModal').modal('hide');
            }
        })
    })

    //删除确认
    $("body").on('click','.delInfo',function(){
        $("#confirmModal").modal('show');
        var id = $(this).parents('tr').data('id');//获取id
        $('#confirmModal').attr("data-id",id);//给模态框设置data-id属性
        var name = $(this).parents('tr').children().eq(1).text();
        //alert(name);
        $("#confirmModal .modal-body").html(' <p>您确定要删除 <span style="color: red;font-weight: bold;">'+name+'</span> 吗？</p>');
    })
    //确认删除
    $("#delete").click(function(){
        var id = $(this).parents('.modal').data('id');
        //alert(id);
        var url = 'removeData.php';
        $.ajax({
            url:url,
            type:'POST',
            data:'id='+id,
            success:function(data){
                var json = JSON.parse(data);
                console.log(json)
                if(json.status=="error"){//删除记录失败的情况
                    //alert('删除记录失败')
                    $("#confirmModal .modal-footer").append('<div class="alert alert-danger">'+json.info+'</div>');
                }
                //window.location.reload();//刷新
            }
        })
    })
})

function toSex(a){
    if(a==0){
        return '女';
    }else{
        return '男';
    }
}

