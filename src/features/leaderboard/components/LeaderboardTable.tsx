import { Badge, Box, Group, Paper, Table, Text } from '@mantine/core';

import { LeaderboardUser } from '../types';

interface LeaderboardTableProps {
  users: LeaderboardUser[];
  currentUserRank?: number;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ users, currentUserRank }) => {
  const rows = users.map((user, index) => (
    <Table.Tr
      key={index}
      style={{
        background: currentUserRank === user.rank ? '#ff9d54/10' : 'transparent',
      }}
    >
      <Table.Td>
        <Badge size="lg" style={{ background: '#ff9d54', color: 'white' }}>
          #{user.rank}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="sm">
          <Box
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #ff9d54, #ff8a30)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
            }}
          >
            {user.name.charAt(0)}
          </Box>
          <Text fw={500} c="white">
            {user.name}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fw={600} style={{ color: '#ff9d54' }}>
          {user.points} pts
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" size="sm">
          🔥 {user.streak} day
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{user.accuracy}%</Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper
      p="lg"
      style={{
        background: '#2a2a2a/70',
        border: '1px solid #3a3a3a',
        borderRadius: '16px',
        overflow: 'auto',
      }}
    >
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr style={{ borderBottom: '2px solid #3a3a3a' }}>
            <Table.Th style={{ color: '#ff9d54' }}>Rank</Table.Th>
            <Table.Th style={{ color: '#ff9d54' }}>Name</Table.Th>
            <Table.Th style={{ color: '#ff9d54' }}>Points</Table.Th>
            <Table.Th style={{ color: '#ff9d54' }}>Streak</Table.Th>
            <Table.Th style={{ color: '#ff9d54' }}>Accuracy</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Paper>
  );
};
