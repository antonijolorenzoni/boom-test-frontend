import IconSave from '@material-ui/icons/Save';
import _ from 'lodash';
import React from 'react';
import { CSVLink } from 'react-csv';
import { connect } from 'react-redux';
import translations from '../../translations/i18next';
import MDButton from '../MDButton/MDButton';

class CSVButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasDownloaded: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data: newData } = nextProps;
    const { data: oldData } = this.props;
    if (_.isEmpty(oldData)) return;
    if (newData !== oldData) {
      this.exportBtn.link.click();
    }
  }

  render() {
    const { data, fetchCSVData, fileName, buttonStyle, containerstyle } = this.props;
    return (
      <div style={{ ...containerstyle }}>
        <MDButton
          title={translations.t('forms.csvDownload')}
          containerstyle={{ width: '100%', ...buttonStyle }}
          titleStyle={{ marginRight: 20 }}
          backgroundColor="#42A5F5"
          icon={<IconSave style={{ color: 'white' }} />}
          onClick={() => fetchCSVData()}
        />
        <div style={{ display: 'none' }}>
          <CSVLink
            data={data}
            filename={fileName}
            ref={(c) => {
              this.exportBtn = c;
            }}
          />
        </div>
      </div>
    );
  }
}

export default connect()(CSVButton);
