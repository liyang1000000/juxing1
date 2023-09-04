/*global angular */
angular.module('scheduler', [])
  .controller('ScheduleController', function($scope, $http) {
    var SCALE = (window.innerWidth / 12 * 11 - 30) / 13;
    var d = new Date();
    var yyyy = d.getFullYear();
    var mm = d.getMonth();
    var dd = d.getDate();
    $scope.selectedDate = new Date(yyyy, mm, dd);
    $scope.target_res = {};
    $scope.reservations = [];
    $scope.showGrid = false;
    $scope.currTime = '00:00';
    $scope.timeProgress = 1;

    $scope.grids = [{
      val: 14
    }, {
      val: 14.5
    }, {
      val: 15
    }, {
      val: 15.5
    }, {
      val: 16
    }, {
      val: 16.5
    }, {
      val: 17
    }, {
      val: 17.5
    }, {
      val: 18
    }, {
      val: 18.5
    }, {
      val: 19
    }, {
      val: 19.5
    }, {
      val: 20
    }, {
      val: 20.5
    }, {
      val: 21
    }, {
      val: 21.5
    }, {
      val: 22
    }, {
      val: 22.5
    }, {
      val: 23
    }, {
      val: 23.5
    }, {
      val: 24
    }, {
      val: 24.5
    }, {
      val: 25
    }, {
      val: 25.5
    }, {
      val: 26
    }, {
      val: 26.5
    }];

    $scope.rooms = [{
      label: 'V1(S)',
      size: 1,
      color: 'info'
    }, {
      label: 'V2(S)',
      size: 1,
      color: 'info'
    }, {
      label: 'V3(S)',
      size: 1,
      color: 'info'
    }, {
      label: 'VIP(L)',
      size: 3,
      color: 'danger'
    }, {
      label: 'V5(M)',
      size: 2,
      color: 'warning'
    }, {
      label: 'V6(S)',
      size: 1,
      color: 'info'
    }, {
      label: 'V7(S)',
      size: 1,
      color: 'info'
    }, {
      label: '08(M)',
      size: 2,
      color: 'warning'
    }, {
      label: 'VIP2(L)',
      size: 3,
      color: 'danger'
    }];

    $scope.new_res = {
      name: '',
      tel: '',
      party_size: 1,
      start_time: 14,
      duration: 1,
      status: 1,
      room: 0,
      note: "",
      resv_time: Date.now(),
      showed_up: 0
    };

    $scope.calcTime = function() {
      var d = new Date();
      var h = d.getHours();
      var m = d.getMinutes();
      if (m < 10) {
        m = '0' + m
      }
      var time = h + ":" + m;
      $scope.currTime = time;
    };

    $scope.calcTimeProgress = function() {
      var d = new Date();
      var h = d.getHours();
      var rate = 1;
      if (h <= 3) {
        rate = ((h + 24 - 14) * 60 + d.getMinutes()) / (13 * 60);
      }
      else {
        rate = ((h - 14) * 60 + d.getMinutes()) / (13 * 60);
      }
      $scope.timeProgress = rate * 100;
    };

    $scope.toggleGrid = function() {
      $scope.showGrid = !$scope.showGrid;
    };

    function syncDate(date) {
      var t = date.getTime() - (date.getTimezoneOffset() * 60000);
      var d = new Date(t);
      return d;
    };

    $scope.convertTimeFormat = function(t) {
      var time;
      if (t >= 24) {
        time = Math.floor(t) % 12 + ':' + (t % 1 * 60 ? '30' : '00') + 'A';
      }
      else {
        time = Math.floor(t) % 12 + ':' + (t % 1 * 60 ? '30' : '00') + 'P';
      }
      return time;
    };

    $scope.load = function(date) {
      $scope.calcTime();
      $scope.calcTimeProgress();
      var d = syncDate(date);
      var t = d.getTime();
      $http({
        method: 'POST',
        url: '/resvs/getallbydateABS',
        data: {
          resv_time_abs: t
        }
      }).
      then(function(response) {
        $scope.reservations = response.data;
      }, function(response) {
        $scope.data = response.data || "Request failed";
        $scope.status = response.status;
        alert('ERROR: Network Error, check your internet connection.');
      });
    };

    $scope.load($scope.selectedDate);

    setInterval(function() {
      if ($scope.selectedDate) {
        $scope.load($scope.selectedDate);
      }
    }, 45000); //update every 45 seconds to detect new reservation

    $scope.changeDate = function() {
      var date = new Date($scope.selectedDate);
      $scope.load(date);
    };

    $scope.getHeight = function(obj) {
      return obj.duration * SCALE;
    };

    $scope.getWidth = function(obj) {
      return obj.duration * SCALE;
    };

    $scope.getGridWidth = function(width) {
      return width * SCALE;
    };

    $scope.getOffsetTop = function(obj) {
      return (obj.start_time - 14) * SCALE;
    };

    $scope.getOffsetLeft = function(obj) {
      return (obj.start_time - 14) * SCALE;
    };

    $scope.getResvColor = function(res) {
      if (res.showed_up) {
        return 'success';
      }
      else if (res.party_size <= 10) {
        return 'info';
      }
      else if (res.party_size <= 14) {
        return 'warning';
      }
      else {
        return 'danger';
      }
    };

    $scope.setTargetRes = function(obj) {
      $scope.target_res_real = obj;
      $scope.target_res = angular.copy(obj);
    };
    
    $scope.resetNewRes = function(){
      $scope.new_res.name = '';
      $scope.new_res.tel = '';
      $scope.new_res.party_size = 1;
      $scope.new_res.start_time = 14;
      $scope.new_res.status = 1;
      $scope.new_res.room = 0,
      $scope.new_res.note = "";
      $scope.new_res.resv_time = Date.now();
      $scope.new_res.showed_up = 0;
    
    };

    $scope.createResv = function() {
      $scope.new_res.resv_time = syncDate($scope.selectedDate);
      $http.post('/resvs/add', angular.copy($scope.new_res)).
      then(function(response) {
        $scope.load($scope.selectedDate);
        //$scope.reservations = response.data;
      }, function(response) {
        alert('ERROR: Network Error, check your internet connection.');
      });
    };

    $scope.updateResv = function(data) {
      $http.post('/resvs/showedup', angular.copy(data)).
      then(function(response) {
        $scope.load($scope.selectedDate);
        //$scope.reservations = response.data;
      }, function(response) {
        alert('ERROR: Network Error, check your internet connection.');
      });
    };

    $scope.changeRoom = function(index) {
      $scope.target_res.room = index + 1;
    };

    $scope.changeCallStatus = function(status) {
      $scope.target_res.contacted = status;
    };

    $scope.guestShowedUp = function() {
      if (!$scope.target_res.showed_up) {
        $scope.target_res.showed_up = !$scope.target_res.showed_up;
      }
    };

    $scope.saveChanges = function() {
      if ($scope.roomIsAvailable($scope.target_res._id, $scope.target_res.room, $scope.target_res.start_time, $scope.target_res.duration)) {
        $scope.target_res_real.room = $scope.target_res.room;
        $scope.target_res_real.party_size = $scope.target_res.party_size;
        $scope.target_res_real.start_time = $scope.target_res.start_time;
        if ($scope.target_res.room > 0) {
          $scope.target_res_real.room_size = $scope.rooms[$scope.target_res.room - 1].size;
        }
        else {
          $scope.target_res_real.room_size = 0;
        }
        $scope.target_res_real.duration = $scope.target_res.duration;
        $scope.target_res_real.status = 2;
        $scope.target_res_real.note = $scope.target_res.note;
        $scope.target_res_real.showed_up = $scope.target_res.showed_up;
        $scope.target_res_real.contacted = $scope.target_res.contacted;
        $scope.target_res_real.UID = $scope.target_res.UID;
        $scope.target_res_real.resv_time = syncDate($scope.selectedDate);
        $scope.target_res_real.resv_time_abs = syncDate($scope.selectedDate).getTime();
        $scope.updateResv($scope.target_res_real);
      }
      else {
        alert('Error: Selected room is not available at this time!');
      }
    };

    $scope.deleteResv = function() {
      $http.post('/resvs/delete', {
        _id: $scope.target_res._id
      }).
      then(function(response) {
        $scope.load($scope.selectedDate);
        //$scope.reservations = response.data;
      }, function(response) {

      });
    };

    $scope.roomIsAvailable = function(_id, room, st, dur) {
      var bool = true;
      if (room > 0) {
        angular.forEach($scope.reservations, function(value, key) {
          if (bool) {
            if (value._id !== _id && value.room === room) {
              if (!(st >= (value.start_time + value.duration) || (st + dur) <= value.start_time)) {
                bool = false;
              }
            }
          }
        });
      }
      return bool;
    };

  });