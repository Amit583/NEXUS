def calculate_goal_status(
    progress: int,
) -> str:
    """
    Calculate the goal lifecycle status
    from its progress value.

    0%       -> active
    1-99%    -> in_progress
    100%     -> completed
    """

    if progress < 0 or progress > 100:
        raise ValueError(
            "Progress must be between 0 and 100."
        )

    if progress == 0:
        return "active"

    if progress == 100:
        return "completed"

    return "in_progress"