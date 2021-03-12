import { Chip, createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Delete from '@material-ui/icons/Delete';
import CompanyIcon from '@material-ui/icons/Domain';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import _ from 'lodash';
import React from 'react';
import translations from '../../../translations/i18next';
import MDButton from '../../MDButton/MDButton';

const styles = (theme) => ({
  row: {
    marginBottom: 15,
    borderTop: '3px solid #4FC3F7',
    padding: 20,
  },
  outerContainer: {
    width: '100%',
    padding: 20,
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 800,
    fontSize: 20,
    color: '#3f3f3f',
  },
  image: {
    objectFit: 'contain',
    height: 50,
    borderRadius: 10,
    marginRight: 20,
  },
  cardContent: {
    alignItems: 'center',
  },
  companyTag: {
    marginRight: 10,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  subtitle: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 100,
    fontSize: 18,
    color: '#3f3f3f',
    fontStyle: 'italic',
  },
});

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#bdbdbd' },
    seconday: '#bdbdbd',
  },
  typography: {
    useNextVariants: true,
  },
});

const ChecklistRow = ({
  checklist: { checklistUrl, authorizedCompanies, title },
  onDeleteFromCompany,
  hideCompanies,
  onDelete,
  canDeleteChecklist,
  classes,
  containerstyle,
  showAuthorizedCompanies,
}) => (
  <MuiThemeProvider theme={theme}>
    <Paper style={{ ...containerstyle }} square className={classes.row}>
      <div className={classes.innerContainer}>
        <div className={classes.cardContent}>
          <h2 className={classes.title}>Checklist</h2>
          {title && <h3 className={classes.subtitle}>{`${title}`}</h3>}
          {!_.isEmpty(authorizedCompanies) && !hideCompanies && (
            <div style={{ marginTop: 10 }}>
              {_.map(authorizedCompanies, (company) => (
                <Chip key={company.id} className={classes.companyTag} color="primary" label={company.name} icon={<CompanyIcon />} />
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MDButton
            title={translations.t('forms.openInNewPageChecklist')}
            className="gradient-button"
            icon={<OpenInNewIcon style={{ color: 'white', marginLeft: 10 }} />}
            titleStyle={{ fontSize: 15 }}
            containerstyle={{ marginLeft: 10, marginRight: 10, marginTop: 0 }}
            backgroundColor="#4FC3F7"
            onClick={() => window.open(checklistUrl)}
          />
          {canDeleteChecklist && (
            <MDButton
              title={translations.t('company.deleteChecklistForCompany')}
              className="gradient-button"
              icon={<RemoveCircle style={{ marginLeft: 10 }} />}
              titleStyle={{ fontSize: 15 }}
              containerstyle={{ marginLeft: 10, marginRight: 10, marginTop: 0 }}
              backgroundColor="#D84315"
              onClick={() => onDeleteFromCompany()}
            />
          )}
          {canDeleteChecklist && (
            <MDButton
              title={translations.t('company.deleteChecklistTotal')}
              className="gradient-button"
              icon={<Delete style={{ marginLeft: 10 }} />}
              titleStyle={{ fontSize: 15 }}
              containerstyle={{ marginLeft: 10, marginRight: 10, marginTop: 0 }}
              onClick={() => onDelete()}
            />
          )}
        </div>
      </div>
    </Paper>
  </MuiThemeProvider>
);

export default withStyles(styles)(ChecklistRow);
