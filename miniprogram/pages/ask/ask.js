// pages/ask/ask.js
const db = wx.cloud.database()
const questionsCollection = db.collection('questions')
const app = getApp()



Page({
  /**
   * Page initial data
   */
  data: {
    question: '',
    question_id: '',
    answerVisible: [],
    fileList: [],
    uploadButtonLabel: "上传图片",
    showUpload: false,
  },

  onChange(e) {
    this.setData({
      question: e.detail.value,
    })
  },

  onClickUpload() {
    const updatedFlag = !this.data.showUpload;
    if(updatedFlag) {
      this.setData({
        fileList: [],
      });
    }
    this.setData({
      showUpload: updatedFlag,
      uploadButtonLabel: updatedFlag ? "取消上传" : "上传图片",
    });
  },

  onUploadChange(e) {
    console.log('onChange', e)
    const {
      file,
      fileList
    } = e.detail
    if (file.status === 'uploading') {
      this.setData({
        progress: 0,
      })
      wx.showLoading()
    } else if (file.status === 'done') {
      this.setData({
        imageUrl: file.url,
      })
    }

    // Controlled state should set fileList
    this.setData({
      fileList
    })
  },
  onUploadSuccess(e) {
    console.log('onSuccess', e)
    console.log('files', this.data.fileList);
  },
  onUploadFail(e) {
    console.log('onFail', e)
  },
  onUploadComplete(e) {
    console.log('onComplete', e)
    wx.hideLoading()
  },
  onUploadProgress(e) {
    console.log('onProgress', e)
    this.setData({
      progress: e.detail.file.progress,
    })
  },
  onUploadPreview(e) {
    console.log('onPreview', e)
    const {
      file,
      fileList
    } = e.detail
    wx.previewImage({
      current: file.url,
      urls: fileList.map((n) => n.url),
    })
  },
  onUploadRemove(e) {
    const {
      file,
      fileList
    } = e.detail
    wx.showModal({
      content: '确定删除？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            fileList: fileList.filter((n) => n.uid !== file.uid),
          })
        }
      },
    })
  },

  submitQuestion() {
    //TODO: write to questions DB
    questionsCollection.add({
      data: {
        question: this.data['question'],
        owner: app.globalData.openid,
        answerVisibleToAll: this.data['answerVisible'].length != 0
      }
    }).then((res) => {
      this.setData({
        question_id: res._id
      })
    }).then((res) => {
      let q_id = this.data['question_id']
      wx.navigateTo({
        url: `../qrcode/qrcode?q_id=${q_id}`
      })
      // console.log(q_id)
    })
  },

  onChangeCheckBoxAnswerVisible(e) {
    this.onChangeCheckBox('answerVisible', e)
  },

  onChangeCheckBox(field, e) {
    const {
      value
    } = e.detail
    const data = this.data[field]
    const index = data.indexOf(value)
    const current = index === -1 ? [...data, value] : data.filter((n) => n !== value)
    this.setData({
      [field]: current,
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})