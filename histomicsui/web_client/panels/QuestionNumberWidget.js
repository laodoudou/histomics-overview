// import View from "../View";
import Panel from '@girder/slicer_cli_web/views/Panel';
import questionNumberWidget from "../templates/panels/questionNumberWidget.pug";

var QuestionNumberWidget = Panel.extend({
    initialize(settings) {
        this.questionNumber = settings.questionNumber || 1; // 默认题号为 1
        this.render();
    },
    render() {
        this.$el.html(questionNumberWidget({
            title: '答题卡',
            questionNumber: this.questionNumber
        }));
        return this;
    },
    updateQuestionNumber(newNumber) {
        this.questionNumber = newNumber;
        this.render();
    },
});

export default QuestionNumberWidget;
