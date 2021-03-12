import React from 'react';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { PLACE_HOLDER, USER_ROLES } from 'config/consts';
import { useTranslation } from 'react-i18next';
import HideFor from 'components/Permission/HideFor';
import { ImportantSpacedWrapper, SpacedRowWrapper } from 'components/Forms/styles';
import { TextSummary } from 'components/TextSummary';

type Props = {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string | undefined;
  phoneNumber: string;
  language: string;
};

const ProfileInfo = ({ firstName, lastName, email, jobTitle, language, phoneNumber }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <ImportantSpacedWrapper>
        <FormSectionHeader iconName="person_pin" label={t('profile.profile')} />
      </ImportantSpacedWrapper>
      <SpacedRowWrapper>
        <TextSummary fullWidth={false} label={t('profile.fullName')} value={`${firstName} ${lastName}`.trim() ?? PLACE_HOLDER} />
        <TextSummary fullWidth={false} label={t('profile.language')} value={t(`languages.${language}`) as any} />
      </SpacedRowWrapper>
      <SpacedRowWrapper>
        <TextSummary fullWidth={false} label={t('profile.phoneNumber')} value={phoneNumber ?? PLACE_HOLDER} />
        <TextSummary fullWidth={false} label={t('profile.email')} value={email ?? PLACE_HOLDER} />
      </SpacedRowWrapper>
      <HideFor roles={[USER_ROLES.ROLE_SMB]}>
        <SpacedRowWrapper>
          <TextSummary fullWidth={false} label={t('profile.jobTitle')} value={jobTitle ?? PLACE_HOLDER} />
        </SpacedRowWrapper>
      </HideFor>
    </>
  );
};

export default ProfileInfo;
