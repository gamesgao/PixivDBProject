var timeVM = new Vue({
    el: '#selector',
    data: {
        quantity: 30,
        baseClass: 'btn btn-block',
        statusClass: 'btn-primary',
        isDisable: false
    },
    methods: {
        searchData: function () {
            timeVM.isDisable = true;
            //取出时间戳  
            var datetime1 = $('#timeInput').data().date;
            var datetimestamp = Date.parse(datetime1).toString();
            console.log(datetimestamp);
            this.$http.get('/data/requireData?time=' + datetimestamp + '&quantity=' + this.quantity).then(
                function (response) {
                    listVM.items = JSON.parse(response.data);
                    // timeVM.statusClass = 'btn-success';
                    timeVM.isDisable = false;
                    // console.log(listVM.items);
                },
                function (err) {
                    timeVM.statusClass = 'btn-danger';
                    timeVM.isDisable = false;
                    console.log(err);
                }
            )
        }
    }
});



var listVM = new Vue({
    el: '#showList',
    data: {
        items: []
    }
});