import _ from 'lodash';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Button, OutlinedButton, Typography } from 'ui-boom-components';
import { Field, reduxForm, change } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { PERMISSIONS, PERMISSION_ENTITIES, SHOOTING_STATUSES_UI_ELEMENTS, USER_ROLES } from 'config/consts';
import AbilityProvider from 'utils/AbilityProvider';
import Permission from 'components/Permission/Permission';
import { AssignedPhotographerPanel } from 'components/AssignedPhotographerPanel';
import FileLinkDropZoneField from 'components/Forms/FormComponents/FileLinkDropZoneField';
import { DownloadLink } from 'components/Shooting/DownloadLink';
import ZipIcon from 'assets/icons/zip-uploaded.svg';
import * as ModalsActions from 'redux/actions/modals.actions';
import InvoicingItemsView from 'components/Invoicing/InvoicingItemsView';
import { confirmShootingPhotosDownload } from 'api/shootingsAPI';
import { LabelTitle, ColLinkWrapper, LinkWrapper, SubTitleLabel, TextSubLabel } from './styles';
import { useOrderScores } from 'hook/orders/useOrderScores';
import { RatingBlock } from 'components/common/RatingBlock';
import { LineBreak } from 'components/common/LineBreak';
import { useWhoAmI } from 'hook/useWhoAmI';
import { FeedbackClientPanel } from 'components/FeedbackClientPanel';
import * as ShootingsApi from 'api/shootingsAPI';
import { useAlertModal } from 'hook/useAlertModal';
import { OrderStatus } from 'types/OrderStatus';

const ShootingDoneView = ({
  initialize,
  shooting,
  onDownloadShootingPhotosToReview,
  onUploadPostProducedPhotos,
  onClose,
  onDownloadReleaseForm,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { boomAverageScore, companyScore } = useOrderScores(true, shooting?.company?.organization, shooting.id);
  const { isClient, isBoom, isPhotographer } = useWhoAmI();

  const {
    id: orderId,
    company: { organization: organizationId },
    code,
    downloadLink,
    state: status,
    photographer,
    releaseFormDownloadLink,
  } = shooting;

  useEffect(() => {
    initialize({ postProducedPhotosUrl: downloadLink });
    // initialize cannot be inside array deps, TODO replace with Formik
    // eslint-disable-next-line
  }, [downloadLink]);

  const { form, isSmbUser } = useSelector((state) => ({
    form: state.form.EditPostProducedPhotosForm,
    isSmbUser: state.user.data.roles.find((role) => role.name === USER_ROLES.ROLE_SMB),
  }));

  const restoreLink = () => {
    dispatch(change('EditPostProducedPhotosForm', 'postProducedPhotosUrl', downloadLink));
  };

  const onRemovePostProducedPhotos = () => dispatch(change('EditPostProducedPhotosForm', 'postProducedPhotosUrl', null));

  const showErrorDialog = () =>
    dispatch(
      ModalsActions.showModal('EDIT_POST_PROD_ERROR', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: t('forms.warning'),
          bodyText: t('forms.zipFormatError'),
          cancelText: t('forms.close'),
        },
      })
    );

  const onCopyLinkToClipboardSuccess = () =>
    dispatch(
      ModalsActions.showModal('COPY_TO_CLIPBOARD_SUCCESS', {
        modalType: 'SUCCESS_ALERT',
        modalProps: {
          message: t('shootings.copiedToClipboard'),
        },
      })
    );

  const { showAlert } = useAlertModal();

  const onSubmitScore = async (rate, note) => {
    try {
      await ShootingsApi.createCompanyShootingScore(organizationId, orderId, {
        companyScore: rate,
        comment: note,
      });

      onClose();
      showAlert(t('shootings.evaluateServiceSuccess'), 'success');
    } catch (error) {
      showAlert(t('shootings.evaluateServiceError'), 'error');
    }
  };

  const getSharableLink = () => {
    return postProducedPhotosUrl ? (
      <CopyToClipboard text={downloadLink} onCopy={onCopyLinkToClipboardSuccess}>
        <Button size="small" backgroundColor={color}>
          <Icon alt="Link To Download" name="link" size={13} style={{ marginRight: 3 }} />
          <span style={{ textTransform: 'uppercase' }}>{t('shootings.getSharableLink')}</span>
        </Button>
      </CopyToClipboard>
    ) : (
      <OutlinedButton size="small" color={color} onClick={restoreLink}>
        {t('permissionsActions.CANCEL')}
      </OutlinedButton>
    );
  };

  const color = SHOOTING_STATUSES_UI_ELEMENTS[status].color;

  const uploadNotes = _.get(shooting, 'uploadNotes.uploadNotes');
  const uploadComments = _.get(shooting, 'uploadComments');

  const postProducedPhotosUrl = form.values.postProducedPhotosUrl;

  const companyScoreComment = _.get(shooting, 'score.scores[4].comment');

  const canEvaluate =
    AbilityProvider.getOrganizationAbilityHelper().hasPermission([PERMISSIONS.EVALUATE], PERMISSION_ENTITIES.SHOOTING) &&
    [OrderStatus.Downloaded, OrderStatus.Done, OrderStatus.Archived].includes(status);

  return (
    <>
      {!isPhotographer && isBoom && photographer && (
        <>
          <LabelTitle>{t('shootings.assignedPhotographer')}</LabelTitle>
          <AssignedPhotographerPanel />
        </>
      )}
      {isBoom && (
        <Permission
          do={[PERMISSIONS.READ]}
          on={PERMISSION_ENTITIES.INVOICEITEM}
          abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
        >
          <div style={{ marginTop: 30 }}>
            <InvoicingItemsView statusColor={color} />
          </div>
        </Permission>
      )}
      {!isPhotographer && (
        <>
          <LabelTitle>{t('shootings.uploadPostProducedPhotos')}</LabelTitle>
          <LinkWrapper>
            <ColLinkWrapper>
              <Field
                name="postProducedPhotosUrl"
                component={FileLinkDropZoneField}
                required
                multiple={false}
                accept=".zip"
                filename={`${code}.zip`}
                icon={<img src={ZipIcon} alt="zipFile" />}
                body={t('forms.shootingDropzonePlaceholderBody')}
                color={color}
                onRemoveFile={isBoom && onRemovePostProducedPhotos}
                onDropRejected={showErrorDialog}
                onFileDropped={onUploadPostProducedPhotos}
                confirmDownload={() => !isBoom && confirmShootingPhotosDownload(organizationId, orderId)}
              />
            </ColLinkWrapper>
            <ColLinkWrapper style={{ position: 'relative', top: -12 }}>{isSmbUser ? null : getSharableLink()}</ColLinkWrapper>
          </LinkWrapper>
          {releaseFormDownloadLink && (
            <>
              <Typography variantName="title2" style={{ marginBottom: 6 }}>
                {t('shootings.releaseForm')}
              </Typography>
              <LinkWrapper style={{ marginBottom: 20 }}>
                <ColLinkWrapper>
                  <DownloadLink filename={`${code}_release_form.zip`} onDownload={onDownloadReleaseForm} color={color} />
                </ColLinkWrapper>
              </LinkWrapper>
            </>
          )}
          {uploadNotes && (
            <>
              <Typography variantName="overline" style={{ textTransform: 'uppercase', marginBottom: 4 }}>
                {t('forms.shootingCompanyNotes')}
              </Typography>
              <Typography variantName="body1" style={{ marginBottom: 15 }}>
                {uploadNotes}
              </Typography>
            </>
          )}
          {(companyScore > 0 || isBoom) && (
            <>
              <Typography variantName="title2" style={{ marginBottom: 14 }}>
                {t(`forms.${isBoom ? `feedbackFromClient` : `feedbackForBoom`}`)}
              </Typography>
              <RatingBlock
                title={t(`shootings.${isBoom ? `companyScore` : `serviceEvaluation`}`)}
                value={companyScore}
                style={{ marginBottom: 10 }}
              />
              <Typography variantName="overline" style={{ textTransform: 'uppercase', marginBottom: 4 }}>
                {t('order.notes')}
              </Typography>
              <Typography variantName="body1" textColor={companyScoreComment ? '#000000' : '#A3ABB1'} style={{ marginBottom: 15 }}>
                {companyScoreComment || t('general.na')}
              </Typography>
            </>
          )}
        </>
      )}
      {isBoom && (
        <>
          <LineBreak style={{ marginBottom: 12 }} />
          <Typography variantName="title2" style={{ marginBottom: 14 }}>
            {t('shootings.downloadShootingRawTitle')}
          </Typography>
          <LinkWrapper>
            <ColLinkWrapper>
              <DownloadLink onDownload={onDownloadShootingPhotosToReview} filename={`${code}.zip`} color={color}></DownloadLink>
            </ColLinkWrapper>
          </LinkWrapper>
          {uploadComments && (
            <>
              <SubTitleLabel style={{ marginTop: 15 }}>{t('shootings.uploadComments')}</SubTitleLabel>
              <TextSubLabel>{uploadComments}</TextSubLabel>
            </>
          )}
          <RatingBlock title={t('shootings.boomAverageScore')} value={boomAverageScore} style={{ marginTop: 15, marginBottom: 13 }} />
        </>
      )}
      {isClient && canEvaluate && !(companyScore > 0) && (
        <div style={{ marginTop: 20 }}>
          <FeedbackClientPanel color={color} isPanelInOperationalView onConfirm={onSubmitScore} />
        </div>
      )}
    </>
  );
};

export default reduxForm({
  form: 'EditPostProducedPhotosForm',
  initialValues: {
    postProducedPhotosUrl: null,
  },
  enableReinitialize: true,
})(ShootingDoneView);
