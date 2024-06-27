const $ = girder.$;
const {wrap} = girder.utilities.PluginUtils;
const {restRequest} = girder.rest;
const JobDetailsWidget = girder.plugins.jobs.views.JobDetailsWidget;

wrap(JobDetailsWidget, 'render', function (render) {
    render.call(this);
    if (this.job && this.job.get('userId') && !this.$el.find('.g-job-info-key[property="userId"]').length) {
        restRequest({
            url: 'user/' + this.job.get('userId'),
            error: null
        }).done((resp) => {
            var record = $('<div class="g-field-container"><div class="g-job-info-key inline" property="userId">User:</div><div class="g-job-info-value inline" property="userId"></div></div>');
            record.find('.g-job-info-value').text(`${resp.login} (${this.job.get('userId')})`);
            this.$el.find('.g-job-info-key[property="_id"]').parent().after(record);
        });
    }
});
