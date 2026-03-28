/**
 * WhatsApp message formatters and deep link generators.
 */

/**
 * Open WhatsApp with a pre-filled message.
 * Uses wa.me deep link — works on both mobile and desktop.
 */
export function openWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encoded}`, '_blank');
}

/**
 * Generate a shareable emergency summary message.
 */
export function generateEmergencyMessage(result) {
  const severityEmoji = {
    Critical: '🔴',
    High: '🟠',
    Medium: '🟡',
    Low: '🟢',
  };

  const emoji = severityEmoji[result.severity] || '⚠️';

  let message = `${emoji} *EMERGENCY ALERT* ${emoji}\n\n`;
  message += `*Situation:* ${result.situation}\n`;
  message += `*Severity:* ${result.severity}\n\n`;

  if (result.detectedIssues?.length > 0) {
    message += `*Issues Detected:* ${result.detectedIssues.join(', ')}\n\n`;
  }

  message += `*What to Do:*\n`;
  result.actions?.forEach((action, i) => {
    message += `${i + 1}. ${action}\n`;
  });

  message += `\n*Call:* ${result.emergencyContact?.name} — ${result.emergencyContact?.number}\n`;
  message += `\n📱 _Sent via Emergency Copilot_`;

  return message;
}

/**
 * Generate a blood request message for WhatsApp.
 */
export function generateBloodRequestMessage({
  bloodGroup,
  units,
  patientName,
  contactName,
  contactPhone,
  hospitalName,
  mapsLink,
}) {
  let message = `🆘 *URGENT BLOOD REQUIRED* 🆘\n\n`;
  message += `*Blood Group:* ${bloodGroup}\n`;
  message += `*Units Needed:* ${units}\n`;

  if (patientName) {
    message += `*Patient:* ${patientName}\n`;
  }

  message += `*Hospital:* ${hospitalName}\n`;

  if (mapsLink) {
    message += `*Location:* ${mapsLink}\n`;
  }

  message += `\n*Contact:* ${contactName} — ${contactPhone}\n`;
  message += `\nPlease donate blood or share this message urgently. Every minute counts! 🙏\n`;
  message += `\n#BloodDonation #EmergencyBlood #SaveALife`;

  return message;
}
