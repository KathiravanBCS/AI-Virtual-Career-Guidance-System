import { Alert, Box, Button, Center, Container, Loader, Tabs } from '@mantine/core';
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { useGetSkillGapsByUser } from '../api/skillGaps/useGetSkillGapsByUser';
import { useGetUserProfileByUser } from '../api/userProfiles/useGetUserProfileByUser';
import { useGetUser } from '../api/users/useGetUser';
import { useGetUserSkillsByUser } from '../api/userSkills/useGetUserSkillsByUser';
import { useGetWorkExperienceByUser } from '../api/workExperience/useGetWorkExperienceByUser';
import SkillGapsTab from '../components/UserEditTabs/SkillGapsTab';
import UserBasicInfoTab from '../components/UserEditTabs/UserBasicInfoTab';
import UserProfileTab from '../components/UserEditTabs/UserProfileTab';
import UserSkillsTab from '../components/UserEditTabs/UserSkillsTab';
import WorkExperienceTab from '../components/UserEditTabs/WorkExperienceTab';

export const UserEditPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const userIdNum = userId ? parseInt(userId, 10) : undefined;

  // Load user data
  const { data: user, isLoading: userLoading, error: userError } = useGetUser(userIdNum);
  const { data: userProfile, isLoading: profileLoading } = useGetUserProfileByUser(userIdNum);
  const { data: workExperiences, isLoading: experienceLoading } = useGetWorkExperienceByUser(userIdNum);
  const { data: skills, isLoading: skillsLoading } = useGetUserSkillsByUser(userIdNum);
  const { data: skillGaps, isLoading: gapsLoading } = useGetSkillGapsByUser(userIdNum);

  const isLoading = userLoading || profileLoading || experienceLoading || skillsLoading || gapsLoading;

  if (userError) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout title="Error" titleProps={{ fw: 700, size: 'h2' }}>
          <Alert icon={<IconAlertCircle />} color="red" title="Error">
            {userError.message || 'Failed to load user data'}
          </Alert>
        </ListPageLayout>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  if (!user) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout title="Error" titleProps={{ fw: 700, size: 'h2' }}>
          <Alert icon={<IconAlertCircle />} color="yellow" title="No Data">
            User not found
          </Alert>
        </ListPageLayout>
      </Container>
    );
  }

  const backButton = (
    <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate(-1)} size="sm">
      Back
    </Button>
  );

  return (
    <Container size="fluid" py="sm">
      <ListPageLayout
        title={`Edit ${user.first_name} ${user.last_name}`}
        titleProps={{ fw: 700, size: 'h2' }}
        description={user.email}
        actions={backButton}
      >
        {/* Info Alert */}
        <Alert icon={<IconAlertCircle />} color="blue" mb="lg">
          Each section can be updated independently. Click save within each tab to update that specific information.
        </Alert>

        {/* Tabs */}
        <Tabs defaultValue="basic-info">
          <Tabs.List>
            <Tabs.Tab value="basic-info">Basic Information</Tabs.Tab>
            <Tabs.Tab value="profile">Profile</Tabs.Tab>
            <Tabs.Tab value="experience">Work Experience</Tabs.Tab>
            <Tabs.Tab value="skills">Skills</Tabs.Tab>
            <Tabs.Tab value="skill-gaps">Skill Gaps</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="basic-info" pt="xl">
            <UserBasicInfoTab user={user} />
          </Tabs.Panel>

          <Tabs.Panel value="profile" pt="xl">
            <UserProfileTab userId={userIdNum} profile={userProfile} />
          </Tabs.Panel>

          <Tabs.Panel value="experience" pt="xl">
            <WorkExperienceTab userId={userIdNum} experiences={workExperiences || []} />
          </Tabs.Panel>

          <Tabs.Panel value="skills" pt="xl">
            <UserSkillsTab userId={userIdNum} skills={skills || []} />
          </Tabs.Panel>

          <Tabs.Panel value="skill-gaps" pt="xl">
            <SkillGapsTab userId={userIdNum} skillGaps={skillGaps || []} />
          </Tabs.Panel>
        </Tabs>
      </ListPageLayout>
    </Container>
  );
};

export default UserEditPage;
