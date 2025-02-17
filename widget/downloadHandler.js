"use strict";

var downloads = {
    sync: function sync($scope, db) {
        db.get((err, res) => {
            let downloadedIDS = [];
            if (err) {
                return callback(err);
            }
            if (res) {
                downloadedIDS = res.map(a => a.mediaId);
                    if ($scope.WidgetHome) {
                        $scope.WidgetHome.item = $scope.WidgetHome.items.map(item => {
                            if (downloadedIDS.indexOf(item.id) > -1) {
                                let downloadedItem = res[downloadedIDS.indexOf(item.id)];
                                if (downloadedItem.mediaType == "video") {
                                    if ((downloadedItem.originalMediaUrl != item.data.videoUrl || !downloadedItem.originalMediaUrl || item.data.videoUrl.length == 0) && window.navigator.onLine) {
                                        item.hasDownloadedMedia = false;
                                        item.data.hasDownloadedVideo = false;
                                        if (!$scope.$$phase) {
                                            $scope.$apply();
                                        }
                                        let type = downloadedItem.mediaPath.split('.').pop();
                                        buildfire.dialog.toast({
                                            message: `Some downloads are deleted`,
                                            type: 'warning',
                                        });
                                        console.log("instance", buildfire.getContext().instanceId);
                                        console.log("mediaId", item.id);
                                        console.log("type", downloadedItem.mediaType);
                                        console.log("extension", type);
                                        buildfire.services.fileSystem.fileManager.deleteFile(
                                            {
                                                path: "/data/mediaCenterManual/" + buildfire.getContext().instanceId + "/" + downloadedItem.mediaType + "/",
                                                fileName: item.id + "." + type
                                            },
                                            (err, isDeleted) => {
                                                if (err) console.error("Error from dm home" + err);
                                   
                                                    new OfflineAccess({
                                                        db: db,
                                                    }).delete({
                                                        mediaId: item.id,
                                                        mediaType: downloadedItem.mediaType,
                                                    });
                                                
                                            }
                                        );
                                    }
                                    else {
                                        item.hasDownloadedMedia = true;
                                        item.data.hasDownloadedVideo = true;
                                    }
                                }

                                else if (downloadedItem.mediaType == "audio") {
                                    item.data.hasDownloadedAudio = true;
                                    item.hasDownloadedMedia = true;
                                }
                            }
                            else {
                                item.hasDownloadedMedia = false;
                                item.data.hasDownloadedVideo = false;
                                item.data.hasDownloadedAudio = false;
                            }
                            return item;
                        });
                    }
                    if ($scope.WidgetMedia) {
                        let matchingItems = res.filter(item => item.mediaId == $scope.WidgetMedia.item.id);
                        if (matchingItems.length > 0) {
                            matchingItems.map(downloadedItem => {
                                if (downloadedItem.mediaType == "video") {
                                    if ((downloadedItem.originalMediaUrl != $scope.WidgetMedia.item.data.videoUrl || !downloadedItem.originalMediaUrl || $scope.WidgetMedia.item.data.videoUrl.length == 0) && window.navigator.onLine) {
                                        let type = downloadedItem.mediaPath.split('.').pop();
                                        buildfire.dialog.toast({
                                            message: `Some downloads are deleted`,
                                            type: 'warning',
                                        });
                                        $scope.WidgetMedia.item.hasDownloadedMedia = false;
                                        $scope.WidgetMedia.item.data.hasDownloadedVideo = false;
                                        if (!$scope.$$phase) {
                                            $scope.$apply();
                                        }
                                        buildfire.services.fileSystem.fileManager.deleteFile(
                                            {
                                                path: "/data/mediaCenterManual/" + buildfire.getContext().instanceId + "/" + downloadedItem.mediaType + "/",
                                                fileName: $scope.WidgetMedia.item.id + "." + type
                                            },
                                            (err, isDeleted) => {
                                                if (err) console.error("Error from dm media" + err);
                                                    new OfflineAccess({
                                                        db: db,
                                                    }).delete({
                                                        mediaId: $scope.WidgetMedia.item.id,
                                                        mediaType: downloadedItem.mediaType,
                                                    });
                                                
                                            }
                                        );
                                    }

                                    else {
                                        $scope.WidgetMedia.item.data.hasDownloadedVideo = true;
                                        $scope.WidgetMedia.item.hasDownloadedMedia = true;
                                    }
                                    // buildfire.dialog.toast({
                                    //     message: `Found downloaded video ${downloadedItem.mediaPath}`,
                                    // });
                                    if (!window.navigator.onLine) {
                                        $scope.WidgetMedia.item.data.videoUrl = downloadedItem.mediaPath;
                                        $scope.WidgetMedia.item.data.topImage = "";
                                    }
                                }

                                else if (downloadedItem.mediaType == "audio") {
                                    if (!window.navigator.onLine) {
                                        $scope.WidgetMedia.item.data.audioUrl = downloadedItem.mediaPath;
                                    }
                                    $scope.WidgetMedia.item.hasDownloadedAudio = true;
                                }

                            });
                        }
                        else {
                            $scope.WidgetMedia.item.hasDownloadedMedia = false;
                            $scope.WidgetMedia.item.data.hasDownloadedVideo = false;
                            $scope.WidgetMedia.item.data.hasDownloadedAudio = false;
                        }
                    }
                }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    }
}