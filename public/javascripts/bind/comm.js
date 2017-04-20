var predVM = new Vue({
    el: "#selector",
    data: {
        lot: 0,
        lat: 0,
        isDisable: false,
        baseClass: 'btn btn-block',
        statusClass: 'btn-primary',
        loopEvent: 0
    },
    methods: {
        searchData: function () {
            predVM.isDisable = true;
            //取出时间戳  
            var datetime1 = $('#timeInput').data().date;
            var datetimestamp = Date.parse(datetime1).toString();
            console.log(datetimestamp);
            if(isNaN(datetimestamp)){
                showVM.predictResult = "请选择日期！";
                predVM.isDisable = false;
                // return;
            }
            else if(this.lot < -180 || this.lot > 180){
                showVM.predictResult = "请输入正确的经度！";
                predVM.isDisable = false;
                // return;
            }
            else if(this.lat < -90 || this.lat > 90){
                showVM.predictResult = "请输入正确的纬度！";
                predVM.isDisable = false;
                // return;
            }
            else{
                this.$http.get('/comm/getPredict?time=' + datetimestamp + '&lot=' + this.lot + '&lat=' + this.lat).then(
                    function (response) {
                        showVM.predictResult = response.data;
                        predVM.statusClass = 'btn-success';
                        predVM.isDisable = false;
                        console.log(showVM.predictResult);
                        predVM.loopEvent = setInterval(checkResult, 1000);
                    },
                    function (err) {
                        predVM.statusClass = 'btn-danger';
                        predVM.isDisable = false;
                        console.log(err);
                    }
                )
            }
        }
    }
});

function checkResult(){
    Vue.http.get('/comm/getResult').then(
        function(response){
            if(response.data != "1"){
                showVM.predictResult = response.data;
                predVM.statusClass = 'btn-success';
                predVM.isDisable = false;
                console.log(showVM.predictResult);
                clearInterval(predVM.loopEvent);
            };
        },
        function(err){
            predVM.statusClass = 'btn-danger';
            predVM.isDisable = false;
            console.log(err);
        }
    )
}
var showVM = new Vue({
    el: "#showBox",
    data: {
        predictResult: "请输入查询信息"
    }
});