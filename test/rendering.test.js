var path = require('path'),
    assert = require('assert'),
    fs = require('fs');

var carto = require('../lib/carto');
var tree = require('../lib/carto/tree');
var helper = require('./support/helper');

describe('Rendering', function() {
helper.files('rendering', 'mml', function(file) {
    it('should render ' + path.basename(file) + ' correctly', function(done) {
        var completed = false;
        var renderResult;
        var mml = helper.mml(file);
        new carto.Renderer({
            paths: [ path.dirname(file) ],
            data_dir: path.join(__dirname, '../data'),
            local_data_dir: path.join(__dirname, 'rendering'),
            filename: file
        }).render(mml, function (err, output) {
            if (err) {
                if (Array.isArray(err)){
                    err.forEach(carto.writeError);
                } else {
                    throw err;
                }
            } else {
                renderResult = output;
                var result = helper.resultFile(file);
                helper.compareToXMLFile(result, output, function(err) {
                    completed = true;
                    if (err) {
                        console.warn(
                            helper.stylize("Failure", 'red') + ': ' +
                            helper.stylize(file, 'underline') +
                            ' differs from expected result.');
                        helper.showDifferences(err);
                        throw '';
                    }
                }, [
                    helper.removeAbsoluteImages,
                    helper.removeAbsoluteDatasources
                ]);
            }
            done();
        });

        // beforeExit(function() {
        //     if (!completed && renderResult) {
        //         console.warn(helper.stylize('renderer produced:', 'bold'));
        //         console.warn(renderResult);
        //     }
        //     assert.ok(completed, 'Rendering finished.');
        // });
    });
});
});
