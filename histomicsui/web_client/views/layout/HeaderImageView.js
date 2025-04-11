import $ from 'jquery';

import {restRequest} from '@girder/core/rest';

import events from '../../events';
import router from '../../router';
import View from '../View';

import headerImageTemplate from '../../templates/layout/headerImage.pug';
import '../../stylesheets/layout/headerImage.styl';
import { getTaskDetail } from '../../api/platformApi.js'

var HeaderImageView = View.extend({
    events: {
        'click .h-open-image': function (evt) {
            events.trigger('h:openImageUi');
        },
        'click .h-open-annotated-image': function (evt) {
            events.trigger('h:openAnnotatedImageUi');
        },
        'click .h-open-taskdetail': function (evt) {
            this.getTaskDetailInfo();// 获取任务说明
        }
    },

    initialize() {
        this.imageModel = null;
        this.parentChain = null;
        this.listenTo(events, 'h:analysis:rendered', this.render);
        this.listenTo(events, 'h:imageOpened', (model) => {
            this.imageModel = model;
            this.parentChain = null;
            this._setNextPreviousImage();
            if (model) {
                this.imageModel.getRootPath((resp) => {
                    this.parentChain = resp;
                    this.render();
                });
            }
            this.render();
        });
    },

    render() {
        const analysis = router.getQuery('analysis') ? `&analysis=${router.getQuery('analysis')}` : '';
        const folder = router.getQuery('folder') ? `&folder=${router.getQuery('folder')}` : '';
        const nextImageLink = this._nextImage ? `#?image=${this._nextImage}${folder}${analysis}` : null;
        const previousImageLink = this._previousImage ? `#?image=${this._previousImage}${folder}${analysis}` : null;
        this.$el.html(headerImageTemplate({
            image: this.imageModel,
            parentChain: this.parentChain,
            previousImageLink,
            previousImageName: this._previousName,
            nextImageLink,
            nextImageName: this._nextName
        }));
        return this;
    },

    _setNextPreviousImage() {
        const model = this.imageModel;
        const folder = router.getQuery('folder') ? `?folderId=${router.getQuery('folder')}` : '';
        if (!model) {
            this._nextImage = null;
            this._previousImage = null;
            this.render();
            return;
        }

        $.when(
            restRequest({
                url: `item/${model.id}/previous_image${folder}`
            }).done((previous) => {
                this._previousImage = (previous._id !== model.id) ? previous._id : null;
                this._previousName = previous.name;
            }),
            restRequest({
                url: `item/${model.id}/next_image${folder}`
            }).done((next) => {
                this._nextImage = (next._id !== model.id) ? next._id : null;
                this._nextName = next.name;
            })
        ).done(() => this.render());
    },

    // 获取任务说明
    getTaskDetailInfo() {
        console.log('任务说明');
        // getTaskDetail(this.imageModel.id || 123);
        getTaskDetail({
            id: this.imageModel.id || 123
        }).then((resp) => {
            console.log(resp);
        }).catch((err) => {
            console.log('获取任务说明失败',err);
        });
    },
});

export default HeaderImageView;
