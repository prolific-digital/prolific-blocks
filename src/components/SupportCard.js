/**
 * Support Card Component
 *
 * Displays a "Need help?" card with a link to block documentation.
 * Used across all Prolific Blocks to provide consistent support access.
 *
 * @param {Object} props - Component props
 * @param {string} props.docUrl - URL to the block's documentation page (optional)
 */

import { __ } from '@wordpress/i18n';
import { Card, CardBody } from '@wordpress/components';

const SupportCard = ({ docUrl }) => {
	// Default to main Prolific Blocks documentation if no specific URL provided
	const documentationUrl = docUrl || 'https://www.notion.so/prolificdigital/Prolific-Blocks-19f5efcd8c5f807f951ac38f50e90f0d';

	return (
		<Card>
			<CardBody>
				<div style={{ marginBottom: '4px' }}>
					{__('Need help?', 'prolific-blocks')}
				</div>
				<a
					href={documentationUrl}
					target="_blank"
					rel="noopener noreferrer"
					style={{
						color: '#007cba',
						textDecoration: 'underline',
						fontWeight: '500',
					}}
				>
					{__('View Documentation', 'prolific-blocks')}
				</a>
			</CardBody>
		</Card>
	);
};

export default SupportCard;
