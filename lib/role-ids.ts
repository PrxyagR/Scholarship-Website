const roleSubmissionIdPattern = /^submitted-role-[0-9a-f-]{20,}$/i;

export function isSubmittedRoleId(value: unknown): value is string {
  return typeof value === 'string' && roleSubmissionIdPattern.test(value);
}
